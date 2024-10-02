const Content = require('../models/ContentModel');
const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');

exports.updatePageContent = async (contentData, fileImage, logoImage) => {
    try {
        let content = await Content.findOne();
        console.log("dawd")
        if (!content) {
            content = new Content(contentData);
            if (fileImage) {
                content.heroImage = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }
            console.log("dawd")
            if (logoImage) {
                content.logo = await uploadToStorage(logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            console.log("dwa")
        } else {
            if (fileImage) {
                content.heroImage = await updateFile(content.heroImage, fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }
            console.log()
            console.log("dwawd")
            if (logoImage) {
                content.logo = await updateFile(content.logo, logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            console.log("dwawdwdaw")
            Object.assign(content, contentData);
        }
        
        console.log("dwawdwdawdaw")
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
