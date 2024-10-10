const { Router } = require('express');
const contentController = require('../controllers/contentController');
const router = Router();
router.get('/about', contentController.getContents);