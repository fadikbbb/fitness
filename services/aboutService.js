const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');
const About = require('../models/aboutModel');

exports.getAbout = async () => {
    const about = await About.findOne();
    return about;
}

exports.updateAbout = async (aboutData,id, fileImage) => {
    try {
        if (fileImage) {
            aboutData.image = await updateFile(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
        }
        const updatedContent = await About.findOneAndUpdate({ _id: id }, aboutData, { new: true });
        return updatedContent;
    } catch (error) {
        throw error
    }
}

exports.createAbout = async (aboutData, fileImage) => {
    try {
        if (fileImage) {
            aboutData.image = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
        }
        const createdAbout = await About.create(aboutData);
        return createdAbout;
    } catch (error) {
        throw error
    }
}
exports.deleteAbout = async (id) => {
    try {
        const deletedAbout = await About.findByIdAndDelete(id);
        if (!deletedAbout) {
            throw new apiError('About not found', 404);
        }
        return deletedAbout;
    } catch (error) {
        throw error
    }
}