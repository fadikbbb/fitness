const trainerService = require('../services/trainerService');


exports.getTrainer = async (req, res, next) => {
    try {
        const trainer = await trainerService.getTrainer();
        res.status(200).json({
            success: true,
            message: 'Trainer retrieved successfully',
            trainer: trainer
        });
    } catch (error) {
        next(error);
    }
}
exports.createTrainer = async (req, res, next) => {
    try {
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const createdTrainer = await trainerService.createTrainer(req.body, imageFile);
        res.status(200).json({
            success: true,
            message: 'trainer created successfully',
            data: createdTrainer
        });
    } catch (error) {
        next(error);
    }
}

exports.updateTrainer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const imageFile = req.files['image'] ? req.files['image'][0] : null;
        const updatedContent = await trainerService.updateTrainer(req.body, id, imageFile);
        res.status(200).json({
            success: true,
            message: 'social media updated successfully',
            data: updatedContent,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteTrainer = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deletedTrainer = await trainerService.deleteTrainer(id);
        res.status(200).json({
            success: true,
            message: 'deleted trainer successfully',
            data: deletedTrainer
        });
    } catch (error) {
        next(error);
    }
}