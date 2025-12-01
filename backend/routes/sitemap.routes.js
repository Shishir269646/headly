const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/sitemap.controller');

router.get('/', sitemapController.getSitemapData);

module.exports = router;
