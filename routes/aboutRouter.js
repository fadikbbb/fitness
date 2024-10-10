// routes/contentRoutes.js
const {Router}= require('express');
const AboutController = require('../controllers/aboutController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { upload } = require('../utils/uploadUtils');
const router = Router();
router.post('/about', authenticate, authorize('admin'), upload, AboutController.updateAbout);
router.get('/about', AboutController.updateAbout);
router.patch('/update-content/about', authenticate, authorize('admin'), upload, AboutController.updateAbout);

module.exports = router;