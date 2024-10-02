const contentService = require('../services/contentService');

exports.updateContent = async (req, res, next) => {
    try {
        const imageFile = req.files['heroImage'] ? req.files['heroImage'][0] : null;
        const logoFile = req.files['logo'] ? req.files['logo'][0] : null;
        const videoFile = req.files['heroVideo'] ? req.files['heroVideo'][0] : null;
        console.log(videoFile)
        const updatedContent = await contentService.updatePageContent(req.body, imageFile, logoFile, videoFile);
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