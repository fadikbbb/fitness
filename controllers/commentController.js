const commentService = require("../services/commentService");

exports.createComment = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;
  try {
    const comment = await commentService.createComment(body, userId);
    return res.status(200).send({ status: "success", data: comment });
  } catch (error) {
    return res.status(400).send({ status: "fail", message: error.message });
  }
};

exports.getAllCommentsWithUser = async (req, res) => {
  try {
    const comments = await commentService.getAllCommentsWithUser();
    return res.status(200).send({ status: "success", data: comments });
  } catch (error) {
    return res.status(500).send({ status: "fail", message: error.message });
  }
};

exports.getCommentById = async (req, res) => {
  const id = req.params.commentId;
  try {
    const comment = await commentService.getCommentById(id);
    return res.status(200).send({ status: "success", data: comment });
  } catch (error) {
    return res.status(404).send({ status: "fail", message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  const id = req.params.commentId;
  const userId = req.user._id;
  const userRole = req.user.role;
  try {
    const message = await commentService.deleteComment(id, userId, userRole);
    return res.status(200).send({ status: "success", message });
  } catch (error) {
    return res.status(400).send({ status: "fail", message: error.message });
  }
};

exports.updateComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;
  const userRole = req.user.role;
  const body = req.body;

  try {
    const updatedComment = await commentService.updateComment(
      commentId,
      body,
      userId,
      userRole
    );
    return res.status(200).send({ status: "success", data: updatedComment });
  } catch (error) {
    return res.status(400).send({ status: "fail", message: error.message });
  }
};
