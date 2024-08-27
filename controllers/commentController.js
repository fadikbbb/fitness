const Comment = require("../models/CommentModel");
// Create Comment
exports.createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const user = req.user;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const comment = new Comment({
      user: user._id,
      content,
    });

    await comment.save();
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating comment", details: error.message });
  }
};

// Get All Comments
exports.getAllComments = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: res.queryResults,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching comments", details: error.message });
  }
};

// Update Comment
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this comment" });
    }

    comment.content = content || comment.content;
    comment.updatedAt = Date.now();

    await comment.save();
    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating comment", details: error.message });
  }
};

// Delete Comment
exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this comment" });
    }
    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error deleting comment", details: error.message });
  }
};
