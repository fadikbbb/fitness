const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');
const Trainer = require('../models/trainerModel');

exports.getTrainer = async () => {
    const trainer = await Trainer.find();
    return trainer;
}

exports.createTrainer = async (trainerData, fileImage) => {
    try {
        if (fileImage) {
            trainerData.image = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
        }
        const createdTrainer = await Trainer.create(trainerData);
        return createdTrainer;
    } catch (error) {
        throw error
    }
}

exports.updateTrainer = async (trainerData, id, fileImage) => {
    try {
        const trainer = await Trainer.findById(id);
        if (!trainer) {
            throw new apiError('Trainer not found', 404);
        }
        if (fileImage) {
            trainerData.image = await updateFile(trainer.image,fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
        }
        const updatedContent = await Trainer.findOneAndUpdate({ _id: id }, trainerData, { new: true });
        return updatedContent;
    } catch (error) {
        throw error
    }
}

exports.deleteTrainer = async (id) => {
    try {
        const deletedTrainer = await Trainer.findByIdAndDelete(id);
        if (!deletedTrainer) {
            throw new apiError('Trainer not found', 404);
        }
        return deletedTrainer;
    } catch (error) {
        throw error
    }
}