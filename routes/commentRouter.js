const { Router } = require("express");
const commentController = require("../controllers/commentController");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const { commentIdValidate } = require("../middlewares/validation/idValidation");
const { query } = require("../middlewares/query");

const router = Router();

router.post("/", authenticate, commentController.createComment);
router.get("/", query(), commentController.getAllCommentsWithUser);
router.get(
  "/:commentId",
  commentIdValidate,
  authenticate,
  commentController.getCommentById
);
router.delete(
  "/:commentId",
  authenticate,
  commentIdValidate,
  authorize("admin"),
  commentController.deleteComment
);
router.patch(
  "/:commentId",
  authenticate,
  commentIdValidate,
  commentController.updateComment
);

module.exports = router;
