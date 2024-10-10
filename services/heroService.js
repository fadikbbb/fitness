const Hero = require('../models/HeroModel');
const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');

exports.updateHero = async (contentData, fileImage, logoImage, fileVideo) => {
    try {
        let content = await Hero.findOne();
        if (!content) {
            if (fileImage) {
                fileImage = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (fileVideo) {
                fileVideo = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (logoImage) {
                logoImage = await uploadToStorage(logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            content = new Content({
                    heroTitle: contentData.heroTitle,
                    heroDescription: contentData.heroDescription,
                    image: fileImage,
                    heroVideo: fileVideo,
                    logo: logoImage
            });
            console.log(content);
        } else {
            if (fileImage) {
                content.image = await updateFile(content.image, fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
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
        const content = await Hero.findOne();
        if (!content) {
            throw new apiError('Content not found', 404);
        }
        return content;
    } catch (error) {
        throw error;
    }
};



