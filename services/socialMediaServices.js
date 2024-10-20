const SocialMedia = require('../models/SocialMediaModels');
const apiError = require('../utils/apiError');

exports.updateSocialMedia = async (body) => {
    try {
        let content = await SocialMedia.findOne();

        if (!content) {
            // Create a new social media document if none exists
            content = new SocialMedia({
                facebook: body.facebook,
                twitter: body.twitter,
                instagram: body.instagram,
                linkedin: body.linkedin,
                whatsApp: body.whatsApp
            });
        } else {
            // Update the existing document
            content.facebook = body.facebook;
            content.twitter = body.twitter;
            content.instagram = body.instagram;
            content.linkedin = body.linkedin;
            content.whatsApp = body.whatsApp;   
        }
        console.log(body);
        await content.save();
        return content;
    } catch (error) {
        throw error;
    }
};


exports.getSocialMedia = async () => {
    try {
        const socialMedia = await SocialMedia.findOne();
        return socialMedia;
    } catch (error) {
        throw error;
    }
}
