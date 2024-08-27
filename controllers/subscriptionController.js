const Subscription = require("../models/SubscriptionModel"); // Import the Subscription model

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { userId, plan, status, startDate, endDate } = req.body;

    // Validate required fields
    if (!userId || !plan || !status || !startDate || !endDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new subscription
    const subscription = new Subscription({
      userId,
      plan,
      status,
      startDate,
      endDate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Save the subscription to the database
    await subscription.save();
    res.status(201).json({ message: "Subscription created successfully", subscription });
  } catch (error) {
    res.status(500).json({ error: "Error creating subscription", details: error.message });
  }
};

// Retrieve all subscriptions
exports.getAllSubscriptions = async (req, res) => {
  try {
    res.status(200).json({ message: "Subscriptions retrieved successfully", subscriptions: res.queryResults });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving subscriptions", details: error.message });
  }
};

// Retrieve a specific subscription by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving subscription", details: error.message });
  }
};

// Update a subscription by ID
exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan, status, startDate, endDate } = req.body;

    // Find the subscription by ID
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Update subscription fields
    subscription.plan = plan || subscription.plan;
    subscription.status = status || subscription.status;
    subscription.startDate = startDate || subscription.startDate;
    subscription.endDate = endDate || subscription.endDate;
    subscription.updatedAt = Date.now();

    // Save the updated subscription to the database
    await subscription.save();

    res.status(200).json({ message: "Subscription updated successfully", subscription });
  } catch (error) {
    res.status(500).json({ error: "Error updating subscription", details: error.message });
  }
};

// Delete a subscription by ID
exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the subscription by ID and delete it
    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subscription", details: error.message });
  }
};
