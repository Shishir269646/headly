const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Media = require('../models/Media.model');
const AuditLog = require('../models/AuditLog.model');
const s3 = require('../config/s3');
const ApiError = require('../utils/apiError');
const fs = require('fs');
const path = require('path');

exports.getAllMedia = async (filters) => {
    const { folder, mimeType, page = 1, limit = 20, search } = filters;

    const query = { isDeleted: false };

    if (folder) query.folder = folder;
    if (mimeType) query.mimeType = { $regex: mimeType, $options: 'i' };
    if (search) {
        query.$or = [
            { originalName: { $regex: search, $options: 'i' } },
            { alt: { $regex: search, $options: 'i' } }
        ];
    }

    const media = await Media.find(query)
        .populate('uploadedBy', 'name email')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Media.countDocuments(query);

    return {
        media,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    };
};

exports.getMediaById = async (mediaId) => {
    const media = await Media.findOne({ _id: mediaId, isDeleted: false })
        .populate('uploadedBy', 'name email');

    if (!media) {
        throw new ApiError(404, 'Media not found');
    }

    return media;
};

exports.uploadMedia = async (file, userId, metadata = {}) => {
    try {
        if (!file || !file.path) {
            throw new ApiError(400, 'Invalid file object');
        }

        const folder = metadata.folder || 'general';
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${Date.now()}-${sanitizedFileName}`;

        let fileUrl;
        let bucket = null;
        let s3Key = null;

        // Check if AWS S3 is configured
        if (process.env.AWS_S3_BUCKET_NAME && process.env.AWS_REGION && 
            process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
            try {
                // Upload to S3 (no ACL to support BucketOwnerEnforced)
                const params = {
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: key,
                    Body: fs.createReadStream(file.path),
                    ContentType: file.mimetype
                };

                await s3.send(new PutObjectCommand(params));
                fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
                bucket = process.env.AWS_S3_BUCKET_NAME;
                s3Key = key;
                
                console.log('S3 Upload Success:', fileUrl);
            } catch (s3Error) {
                console.error('S3 Upload Error:', s3Error);
                // Fallback to local storage if S3 fails
                throw new ApiError(500, `S3 upload failed: ${s3Error.message}`);
            }
        } else {
            // Fallback to local storage if S3 is not configured
            console.warn('AWS S3 not configured, using local storage fallback');
            
            // Ensure uploads directory exists
            const uploadsDir = path.join(__dirname, '../uploads');
            const folderDir = path.join(uploadsDir, folder);
            
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            if (!fs.existsSync(folderDir)) {
                fs.mkdirSync(folderDir, { recursive: true });
            }

            // Move file from tmp to permanent location
            const targetPath = path.join(folderDir, `${Date.now()}-${sanitizedFileName}`);
            fs.copyFileSync(file.path, targetPath);
            
            // Generate full URL for local storage
            // Use relative path that will be served by express.static
            fileUrl = `/uploads/${folder}/${path.basename(targetPath)}`;
            console.log('Local Upload Success:', fileUrl);
        }

        // Clean up temporary file
        try {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        } catch (cleanupError) {
            console.error('Failed to cleanup temp file:', cleanupError);
        }

        // Create media record
        const media = await Media.create({
            filename: key,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: fileUrl,
            thumbnailUrl: fileUrl, // Placeholder, can be a different size
            bucket: bucket,
            key: s3Key,
            uploadedBy: userId,
            alt: metadata.alt || '',
            caption: metadata.caption || '',
            folder: folder
        });

        await AuditLog.create({
            user: userId,
            action: 'UPLOAD_MEDIA',
            resource: 'media',
            resourceId: media._id
        });

        return media;
    } catch (error) {
        // Clean up temporary file on error
        if (file && file.path && fs.existsSync(file.path)) {
            try {
                fs.unlinkSync(file.path);
            } catch (cleanupError) {
                console.error('Failed to cleanup temp file on error:', cleanupError);
            }
        }
        
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, `Media upload failed: ${error.message}`);
    }
};

exports.uploadMultipleMedia = async (files, userId) => {
    const uploadPromises = files.map(file => exports.uploadMedia(file, userId));
    return await Promise.all(uploadPromises);
};

exports.updateMedia = async (mediaId, updateData) => {
    const media = await Media.findOne({ _id: mediaId, isDeleted: false });

    if (!media) {
        throw new ApiError(404, 'Media not found');
    }

    const allowedUpdates = ['alt', 'caption', 'folder'];
    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            media[field] = updateData[field];
        }
    });

    await media.save();
    return media;
};

exports.deleteMedia = async (mediaId) => {
    const media = await Media.findOne({ _id: mediaId, isDeleted: false });

    if (!media) {
        throw new ApiError(404, 'Media not found');
    }

    // Delete from S3
    if (media.bucket && media.key) {
        try {
            await s3.send(new DeleteObjectCommand({
                Bucket: media.bucket,
                Key: media.key
            }));
        } catch (error) {
            console.error('S3 deletion failed:', error);
        }
    }

    media.isDeleted = true;
    await media.save();

    await AuditLog.create({
        user: media.uploadedBy,
        action: 'DELETE_MEDIA',
        resource: 'media',
        resourceId: media._id
    });
};