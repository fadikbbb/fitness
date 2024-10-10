const { Router } = require('express');
const serviceController = require('../controllers/serviceController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { upload } = require('../utils/uploadUtils');
const router = Router();
// Services route
router.post('/services', authenticate, authorize('admin'), upload, serviceController.createService);
router.get('/services', serviceController.getServices);
router.patch('/services/:id', authenticate, authorize('admin'), upload, serviceController.updateService);
router.delete('/services/:id', authenticate, authorize('admin'), serviceController.deleteService);

module.exports = router;