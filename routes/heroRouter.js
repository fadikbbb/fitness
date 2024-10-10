// routes/contentRoutes.js
const { Router } = require('express');
const heroController = require('../controllers/heroController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { upload } = require('../utils/uploadUtils');
const router = Router();

// Admin route to update content
router.get('/', heroController.getContent);
// Hero route
router.patch('/update-content/hero', authenticate, authorize('admin'), upload, heroController.updateHero);

module.exports = router;