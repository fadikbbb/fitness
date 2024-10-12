const Hero = require('../models/HeroModels');
const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');

exports.updateHero = async (heroData, fileImage, logoImage, fileVideo) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) {
            if (fileImage) {
                fileImage = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (fileVideo) {
                fileVideo = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (logoImage) {
                logoImage = await uploadToStorage(logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            hero = new Hero({
                title: heroData.title,
                description: heroData.description,
                image: fileImage,
                video: fileVideo,
                logo: logoImage
            });

        } else {

            if (fileImage) {
                hero.image = await updateFile(hero.image, fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (fileVideo) {
                hero.video = await updateFile(hero.video, fileVideo.originalname, fileVideo.mimetype, fileVideo.buffer, 'video');
            }

            if (logoImage) {
                hero.logo = await updateFile(hero.logo, logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            Object.assign(hero, heroData);
        }
        console.log(hero)
        const updatedContent = await hero.save();
        return updatedContent;
    } catch (error) {
        throw error
    }
};
exports.getHero = async () => {
    try {
        const hero = await Hero.findOne();
        if (!hero) {
            throw new apiError('Content not found', 404);
        }
        return hero;
    } catch (error) {
        throw error;
    }
};



