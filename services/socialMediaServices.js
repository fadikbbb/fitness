const SocialMedia = require('../models/SocialMediaModel');
const apiError = require('../utils/apiError');
exports.updateSocialMedia = async (body, id) => {
    try {
        const content = await SocialMedia.findByIdAndUpdate( id, body, { new: true } );
        if (!content) {
            throw new apiError('Social Media not found', 404);
        }
        return content;
    } catch (error) {
        throw error;
    }
};