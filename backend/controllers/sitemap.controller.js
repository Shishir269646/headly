const sitemapService = require('../services/sitemap.service');
const { successResponse } = require('../utils/responses');

exports.getSitemapData = async (req, res, next) => {
    try {
        const sitemapData = await sitemapService.getSitemapData();
        successResponse(res, sitemapData, 'Sitemap data retrieved successfully');
    } catch (error) {
        next(error);
    }
};
