// controllers/contentController.js
const contentService = require('../services/contentService');

exports.updateContent = async (req, res, next) => {
    try {
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const updatedContent = await contentService.updatePageContent(req.body, imageFile);
        res.status(200).json({
            success: true,
            message: 'Content updated successfully',
            data: updatedContent,
        });
    } catch (error) {
        next(error);
    }
};

exports.getContent = async (req, res, next) => {
    try {
        const content = await contentService.getContent();
        res.status(200).json({
            success: true,
            message: 'Content retrieved successfully',
            data: content,
        });
    } catch (error) {
        next(error);
    }
}