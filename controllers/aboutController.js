const aboutService = require('../services/aboutService');

exports.getAbout = async (req, res, next) => {
    try {
        const about = await aboutService.getAbout();
        res.status(200).json({
            success: true,
            message: 'About retrieved successfully',
            about: about
        });
    } catch (error) {
        next(error);
    }
}
exports.createAbout = async (req, res, next) => {
    try {
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const createdAbout = await aboutService.createAbout(req.body, imageFile);
        res.status(200).json({
            success: true,
            message: 'about created successfully',
            data: createdAbout
        });
    } catch (error) {
        next(error);
    }
}

exports.updateAbout = async (req, res, next) => {
    try {
        const { id } = req.params;
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const updatedContent = await aboutService.updateAbout(req.body, id, imageFile);
        res.status(200).json({
            success: true,
            message: 'social media updated successfully',
            data: updatedContent,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteAbout = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedAbout = await aboutService.deleteAbout(id);
        res.status(200).json({
            success: true,
            message: 'deleted about successfully',
            data: deletedAbout
        });
    } catch (error) {
        next(error);
    }
}