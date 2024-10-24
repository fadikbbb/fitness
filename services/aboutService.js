const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');
const About = require('../models/AboutModel');

exports.getAbout = async () => {
    const about = await About.find();
    return about;
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

exports.updateAbout = async (aboutData, id, fileImage) => {
    try {
        const about = await About.findById(id);
        if (!about) {
            throw new apiError('About not found', 404);
        }
        if (fileImage) {
            aboutData.image = await updateFile(about.image,fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
        }
        const updatedContent = await About.findOneAndUpdate({ _id: id }, aboutData, { new: true });
        return updatedContent;
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