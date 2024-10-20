const { Router } = require('express');
const serviceController = require('../controllers/serviceController');
const socialMediaController = require('../controllers/socialMediaController');
const AboutController = require('../controllers/aboutController');
const heroController = require('../controllers/heroController');
const TrainerController = require('../controllers/trainerController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const settingsValidation = require('../middlewares/validation/settingsValidation');
const { upload } = require('../utils/uploadUtils');
const router = Router();

// Services route
router.get('/services', serviceController.getServices);
router.post('/services', authenticate, authorize('admin'), upload, serviceController.createService);
router.patch('/update-content/services/:id', authenticate, authorize('admin'), upload, serviceController.updateService);
router.delete('/services/:id', authenticate, authorize('admin'), serviceController.deleteService);

// Social Media route
router.get('/social-media', socialMediaController.getSocialMedia);
router.patch('/update-content/social-media',
    authenticate, authorize('admin'),
    settingsValidation.settingsSocialMediaValidationMiddleware,
    socialMediaController.updateSocialMedia);

// Hero route
router.get('/hero', heroController.getHero);
router.patch('/update-content/hero',
    authenticate,
    authorize('admin'),
    upload,
    settingsValidation.settingsHeroValidationMiddleware,
    heroController.updateHero
);

// About route
router.get('/about', AboutController.getAbout);
router.post('/about', authenticate, authorize('admin'), upload, AboutController.createAbout);
router.patch('/update-content/about/:id', authenticate, authorize('admin'), upload, AboutController.updateAbout);
router.delete('/about/:id', authenticate, authorize('admin'), AboutController.deleteAbout);

// Trainer route
router.get('/trainer', TrainerController.getTrainer);
router.post('/trainer', authenticate, authorize('admin'), upload, TrainerController.createTrainer);
router.patch('/update-content/trainer/:id', authenticate, authorize('admin'), upload, TrainerController.updateTrainer);
router.delete('/trainer/:id', authenticate, authorize('admin'), TrainerController.deleteTrainer);

module.exports = router;
