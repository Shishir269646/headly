
const Media = require('../models/Media.model');
const AuditLog = require('../models/AuditLog.model');
const cloudinary = require('../config/cloudinary');
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
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
            folder: metadata.folder || 'headly/general',
            resource_type: 'auto',
            transformation: [
                { width: 1920, height: 1080, crop: 'limit' },
                { quality: 'auto' }
            ]
        });

        // Create media record
        const media = await Media.create({
            filename: result.public_id,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            url: result.secure_url,
            thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
            cloudinaryId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            uploadedBy: userId,
            alt: metadata.alt || '',
            caption: metadata.caption || '',
            folder: metadata.folder || 'general'
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

    // Delete from Cloudinary
    if (media.cloudinaryId) {
        try {
            await cloudinary.uploader.destroy(media.cloudinaryId);
        } catch (error) {
            console.error('Cloudinary deletion failed:', error);
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

