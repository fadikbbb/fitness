// routes/contentRoutes.js
const express = require('express');
const contentController = require('../controllers/contentController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { upload } = require('../utils/uploadUtils');
const { contentValidationRules } = require('../middlewares/validation');
const router = express.Router();

// Admin route to update content
router.get('/', contentController.getContent);
router.patch('/update-content', authenticate, authorize('admin'), upload, contentValidationRules, contentController.updateContent);

module.exports = router;
