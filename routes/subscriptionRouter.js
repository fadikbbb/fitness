const express = require("express");
const router = express.Router(); // Create a new router instance
const subscriptionController = require("../controllers/subscriptionController"); // Import the controller functions
const authenticate = require("../middleware/authenticate"); // Import the authentication middleware
const authorize = require("../middleware/authorize");
const Subscription = require("../models/SubscriptionModel"); // Import the Subscription model
const { query } = require("../middleware/query"); // Import the query middleware

// Apply authentication middleware to all routes
router.use(authenticate);

// Route to create a new subscription
router.post("/", subscriptionController.createSubscription);

// Route to retrieve all subscriptions with query middleware applied
router.get("/", authorize("admin"), query(Subscription), subscriptionController.getAllSubscriptions);

// Route to update a subscription by ID
router.put("/:id", subscriptionController.updateSubscription);

// Route to delete a subscription by ID
router.delete("/:id", subscriptionController.deleteSubscription);

module.exports = router;
