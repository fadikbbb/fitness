const Hero = require('../models/HeroModels');
const apiError = require('../utils/apiError');
const { updateFile, uploadToStorage } = require('../utils/uploadUtils');

exports.updateHero = async (heroData, fileImage, logoImage, fileVideo) => {
    try {
        let hero = await Hero.findOne();
        if (!hero) {
            if (fileImage) {
                console.log('heroImage')
                fileImage = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }
            if (fileVideo) {
                console.log('heroVideo')
                fileVideo = await uploadToStorage(fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }

            if (logoImage) {
                console.log('logoImage')
                logoImage = await uploadToStorage(logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            hero = new Hero({
                companyName: heroData.companyName,
                heroTitle: heroData.heroTitle,
                heroDescription: heroData.heroDescription,
                heroImage: fileImage,
                heroVideo: fileVideo,
                logo: logoImage
            });

        } else {
            if (fileImage) {
                hero.heroImage = await updateFile(hero.heroImage, fileImage.originalname, fileImage.mimetype, fileImage.buffer, 'img');
            }
            if (fileVideo) {
                hero.heroVideo = await updateFile(hero.heroVideo, fileVideo.originalname, fileVideo.mimetype, fileVideo.buffer, 'video');
            }
            if (logoImage) {
                hero.logo = await updateFile(hero.logo, logoImage.originalname, logoImage.mimetype, logoImage.buffer, 'img');
            }
            Object.assign(hero, heroData);
        }
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



