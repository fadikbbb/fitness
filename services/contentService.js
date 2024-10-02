const Content = require('../models/ContentModel');
const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');

exports.updatePageContent = async (contentData, fileImage, logoImage, fileVideo) => {
    try {
        let content = await Content.findOne();
        if (!content) {
            content = new Content(contentData);
            if (fileImage) {
                content.heroImage = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (fileVideo) {
                content.heroImage = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (logoImage) {
                content.logo = await uploadToStorage(logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
        } else {
            if (fileImage) {
                content.heroImage = await updateFile(content.heroImage, fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (fileVideo) {
                content.heroVideo = await updateFile(content.heroVideo, fileVideo.originalname, fileVideo.mimetype, fileVideo.buffer, 'video');
            }

            if (logoImage) {
                content.logo = await updateFile(content.logo, logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            Object.assign(content, contentData);
        }
        const updatedContent = await content.save();
        return updatedContent;
    } catch (error) {
        throw error
    }
};


exports.getContent = async () => {
    try {
        const content = await Content.findOne();
        if (!content) {
            throw new apiError('Content not found', 404);
        }
        return content;
    } catch (error) {
        throw error;
    }
};
