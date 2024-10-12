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
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const logoFile = req.files['logo'] ? req.files['logo'][0] : null;
        const videoFile = req.files['video'] ? req.files['video'][0] : null;
        console.log(videoFile, 'videoFile', imageFile, 'imageFile', logoFile, 'logoFile'); ;
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








