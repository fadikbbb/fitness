const Comment = require("../models/CommentModel");
const apiError = require("../utils/apiError");

exports.createComment = async (body, userId) => {
  try {
    if (!body.content) {
      throw new apiError("Content is required", 400);
    }
    body.userId = userId;
    return await Comment.create(body);
  } catch (error) {
    throw error;
  }
};

exports.getAllCommentsWithUser = async () => {
  try {
    return await Comment.find().populate("userId", "firstName lastName");
  } catch (error) {
    throw error;
  }
};

exports.getCommentById = async (commentId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new apiError("Comment not found", 404);
    }
    return comment;
  } catch (error) {
    throw error;
  }
};

exports.deleteComment = async (commentId, userId, userRole) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new apiError("Comment not found", 404);
    }
    if (userId.toString() !== comment.userId.toString() && userRole !== "admin") {
      throw new apiError("Unauthorized", 401);
    }
    await Comment.findByIdAndDelete(commentId);
    return "Comment deleted";
  } catch (error) {
    throw error;
  }
};

exports.updateComment = async (commentId, body, userId, userRole) => {
  try {
    if (!body.content) {
      throw new apiError("Content is required", 400);
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new apiError("Comment not found", 404);
    }
    if (userId.toString() !== comment.userId.toString() && userRole !== "admin") {
      throw new apiError("Unauthorized", 401);
    }
    return await Comment.findByIdAndUpdate(commentId, body, { new: true });
  } catch (error) {
    throw error;
  }
};
