
const Contact = require('../models/Contact.model');
const logger = require('../utils/logger');
const { AppError } = require('../utils/apiError');

/**
 * Create a new contact submission
 */
const createContact = async (contactData) => {
    try {
        const contact = await Contact.create(contactData);
        logger.info(`New contact form submitted: ${contact.email}`);
        return contact;
    } catch (error) {
        logger.error('Error creating contact:', error);
        throw error;
    }
};

/**
 * Get all contact submissions (admin only)
 */
const getContacts = async (filter = {}, options = {}) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = options.sortBy || '-createdAt';

        const contacts = await Contact.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await Contact.countDocuments(filter);

        return {
            contacts,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        logger.error('Error getting contacts:', error);
        throw error;
    }
};

/**
 * Get a single contact by ID (admin only)
 */
const getContactById = async (contactId) => {
    const contact = await Contact.findById(contactId);
    
    if (!contact) {
        throw new AppError('Contact not found', 404);
    }

    return contact;
};

/**
 * Update contact status (admin only)
 */
const updateContact = async (contactId, updateData) => {
    const contact = await Contact.findByIdAndUpdate(
        contactId,
        updateData,
        { new: true, runValidators: true }
    );

    if (!contact) {
        throw new AppError('Contact not found', 404);
    }

    logger.info(`Contact updated: ${contactId}`);
    return contact;
};

/**
 * Delete a contact (admin only)
 */
const deleteContact = async (contactId) => {
    const contact = await Contact.findByIdAndDelete(contactId);

    if (!contact) {
        throw new AppError('Contact not found', 404);
    }

    logger.info(`Contact deleted: ${contactId}`);
    return contact;
};

/**
 * Mark contact as read (admin only)
 */
const markAsRead = async (contactId) => {
    return updateContact(contactId, { read: true });
};

/**
 * Update contact status
 */
const updateStatus = async (contactId, status) => {
    const validStatuses = ['new', 'in-progress', 'resolved', 'archived'];
    
    if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status', 400);
    }

    return updateContact(contactId, { status });
};

module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact,
    markAsRead,
    updateStatus
};


