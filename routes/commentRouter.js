const express = require("express");
const commentController = require("../controllers/commentController");
const authenticate = require("../middleware/authenticate");
const Comment = require("../models/CommentModel");
const { query } = require("../middleware/query");
const router = express.Router();

// Apply authentication middleware
router.use(authenticate);

// Comment routes
router.post("/", commentController.createComment); // Create a comment
router.get("/", query(Comment), commentController.getAllComments); // Get all comments
router.put("/:id", commentController.updateComment); // Update a comment
router.delete("/:id", commentController.deleteComment); // Delete a comment

module.exports = router;
