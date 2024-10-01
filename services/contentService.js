// services/contentService.js
const Content = require('../models/ContentModel');
const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');

exports.updatePageContent = async (contentData, fileImage) => {
    try {
        let content = await Content.findOne();

        // If content doesn't exist, create a new one
        if (!content) {
            content = new Content(contentData);
            if (fileImage) {
                content.heroImage = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }
        } else {
            // If content exists, update the fields
            if (fileImage) {
                content.heroImage = await updateFile(content.heroImage, fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }
            Object.assign(content, contentData);
        }

        // Save the content (this will automatically update `updatedAt`)
        const updatedContent = await content.save();
        return updatedContent;
    } catch (error) {
        console.error('Error updating page content:', error);
        throw error;
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
