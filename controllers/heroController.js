const heroService = require('../services/heroService');
exports.getHero = async (req, res, next) => {
    try {
        const hero = await heroService.getHero();
        res.status(200).json({
            success: true,
            message: 'hero fetched successfully',
            hero
        });
    } catch (error) {
        next(error);
    }
}
exports.updateHero = async (req, res, next) => {
    try {
        const imageFile = req.files['heroImage'] ? req.files['heroImage'][0] : null;
        const videoFile = req.files['heroVideo'] ? req.files['heroVideo'][0] : null;
        const logoFile = req.files['logo'] ? req.files['logo'][0] : null;
        const updatedContent = await heroService.updateHero(req.body, imageFile, logoFile, videoFile);
        res.status(200).json({
            success: true,
            message: 'hero updated successfully',
            data: updatedContent,
        });
    } catch (error) {
        next(error);
    }
};








