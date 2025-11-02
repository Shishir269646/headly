const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const Media = require('../models/Media.model');
const AuditLog = require('../models/AuditLog.model');
const s3 = require('../config/s3');
const ApiError = require('../utils/apiError');

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
        const folder = metadata.folder || 'general';
        const key = `${folder}/${Date.now()}-${file.originalname}`;

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: require('fs').createReadStream(file.path),
            ContentType: file.mimetype
        };

        console.log('S3 Upload Params:', params);
        await s3.send(new PutObjectCommand(params));
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        console.log('S3 Upload Result:', fileUrl);

        // Create media record
        const media = await Media.create({
            filename: key,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: fileUrl,
            thumbnailUrl: fileUrl, // Placeholder, can be a different size
            bucket: process.env.AWS_S3_BUCKET_NAME,
            key: key,
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
        throw new ApiError(500, `Media upload failed: ${error.message}`);
    }
};

exports.uploadMultipleMedia = async (files, userId) => {
    const uploadPromises = files.map(file => this.uploadMedia(file, userId));
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