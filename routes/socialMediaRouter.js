
const express = require('express');
const contentController = require('../controllers/heroController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { contentValidationRules } = require('../middlewares/validation');
const router = express.Router();
// Social Media route
router.patch('/update-content/socialMedia', authenticate, authorize('admin'), contentValidationRules, contentController.updateSocialMedia);
module.exports = router;