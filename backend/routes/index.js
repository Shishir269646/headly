
const express = require('express');
const router = express.Router();
const v1Routes = require('./v1');

// API versioning
router.use('/v1', v1Routes);

// Default route
router.get('/', (req, res) => {
    res.json({
        message: 'Headly API',
        version: '1.0.0',
        docs: '/api/v1/docs'
    });
});

module.exports = router;


// ============================================
// 📄 src/routes/v1/index.js (V1 Routes Aggregator)
// ============================================

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const contentRoutes = require('./content.routes');
const mediaRoutes = require('./media.routes');
const webhookRoutes = require('./webhook.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contents', contentRoutes);
router.use('/media', mediaRoutes);
router.use('/webhooks', webhookRoutes);

module.exports = router;
