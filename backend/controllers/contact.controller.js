
const catchAsync = require('../utils/asyncHandler');
const contactService = require('../services/contact.service');
const { successResponse } = require('../utils/responses');
const logger = require('../utils/logger');

/**
 * Create a new contact form submission
 * POST /api/v1/contact
 */
exports.createContact = catchAsync(async (req, res) => {
    const contact = await contactService.createContact(req.body);
    
    logger.info(`Contact form submitted: ${contact.email}`);
    
    successResponse(res, {
        id: contact._id,
        submittedAt: contact.createdAt
    }, 'Thank you for contacting us. We will get back to you soon!', 201);
});

/**
 * Get all contact submissions (admin only)
 * GET /api/v1/contact
 */
exports.getContacts = catchAsync(async (req, res) => {
    const { status, read, page, limit, sortBy } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (read !== undefined) filter.read = read === 'true';
    
    const options = { page, limit, sortBy };
    
    const result = await contactService.getContacts(filter, options);
    
    successResponse(res, result, 'Contacts retrieved successfully');
});

/**
 * Get a single contact by ID (admin only)
 * GET /api/v1/contact/:id
 */
exports.getContactById = catchAsync(async (req, res) => {
    const contact = await contactService.getContactById(req.params.id);
    
    successResponse(res, contact, 'Contact retrieved successfully');
});

/**
 * Update contact (admin only)
 * PATCH /api/v1/contact/:id
 */
exports.updateContact = catchAsync(async (req, res) => {
    const contact = await contactService.updateContact(
        req.params.id,
        req.body
    );
    
    successResponse(res, contact, 'Contact updated successfully');
});

/**
 * Delete a contact (admin only)
 * DELETE /api/v1/contact/:id
 */
exports.deleteContact = catchAsync(async (req, res) => {
    await contactService.deleteContact(req.params.id);
    
    successResponse(res, null, 'Contact deleted successfully');
});

/**
 * Mark contact as read (admin only)
 * PATCH /api/v1/contact/:id/read
 */
exports.markAsRead = catchAsync(async (req, res) => {
    const contact = await contactService.markAsRead(req.params.id);
    
    successResponse(res, contact, 'Contact marked as read');
});

/**
 * Update contact status (admin only)
 * PATCH /api/v1/contact/:id/status
 */
exports.updateStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const contact = await contactService.updateStatus(req.params.id, status);
    
    successResponse(res, contact, 'Contact status updated successfully');
});


