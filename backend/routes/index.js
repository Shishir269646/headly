

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const contentRoutes = require('./content.routes');
const mediaRoutes = require('./media.routes');
const webhookRoutes = require('./webhook.routes');
const contactRoutes = require('./contact.routes');
const newsletterRoutes = require('./newsletter.routes');
const analyticsRoutes = require('./analytics.routes');
const commentRoutes = require('./comment.routes');
const dashboardRoutes = require('./dashboard.routes');
const categoryRoutes = require('./category.routes');
const sitemapRoutes = require('./sitemap.routes');

// Health route under /api for convenience
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contents', contentRoutes);
router.use('/categories', categoryRoutes);
router.use('/media', mediaRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/contact', contactRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/comments', commentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/sitemap', sitemapRoutes);


module.exports = router;

