const socialMediaService = require("../services/socialMediaServices");

exports.getSocialMedia = async (req, res, next) => {
  try {
    const socialMedia = await socialMediaService.getSocialMedia();
    res.status(200).json({
      success: true,
      message: "social media fetched successfully",
      socialMedia,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateSocialMedia = async (req, res, next) => {
  try {
    const body = req.body;
    const updatedContent = await socialMediaService.updateSocialMedia(body);
    res.status(200).json({
      success: true,
      message: "social media updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    next(error);
  }
};
