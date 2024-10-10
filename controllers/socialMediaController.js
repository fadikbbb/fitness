const socialMediaService = require('../services/socialMediaServices');
exports.updateSocialMedia = async (req, res, next) => {
    try {
        const updatedContent = await socialMediaService.updateSocialMedia(req.body, id);
        res.status(200).json({
            success: true,
            message: 'social media updated successfully',
            data: updatedContent,
        });
    } catch (error) {
        next(error);
    }
};

