const Content=require('../models/ContentModel');
exports.getContents = async (req, res, next) => {
    try {
        const contents=await Content.find();
        res.status(200).json({
            success: true,
            message: 'Content retrieved successfully',
            data: content,
        });
    } catch (error) {
        next(error);
    }
}