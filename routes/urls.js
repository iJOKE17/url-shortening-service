const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Create Shorten URL
router.post('/shorten', urlController.shortenUrl);

// Retrieve Original URL
router.get('/shorten/:shortCode', urlController.retrieveUrl);

// Update Short URL
router.put('/shorten/:shortCode', urlController.updateUrl);

// // Delete Short URL
router.delete('/shorten/:shortCode', urlController.deleteUrl);

// Get URL Statistics
router.get('/shorten/:shortCode/stats', urlController.getUrlStats);

// Redirect to original URL (should be last to avoid conflicts)
router.get('/:shortCode', urlController.redirectUrl);

module.exports = router;