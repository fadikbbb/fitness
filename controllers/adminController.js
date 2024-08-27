const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

// Create User
exports.createUser = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      weight,
      height,
      dateOfBirth,
      role,
      profileImage,
      subscriptionStatus,
    } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      gender,
      weight,
      height,
      dateOfBirth,
      role,
      profileImage,
      subscriptionStatus,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error creating user" }); // Removed details for production safety
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: res.queryResults,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" }); // Removed details for production safety
  }
};

// Get User By ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-passwordHash"); // Exclude passwordHash

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" }); // Removed details for production safety
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (updates.password) {
      // Hash the new password before updating
      updates.passwordHash = await bcrypt.hash(updates.password, 12);
      delete updates.password; // Ensure plain password is not saved
    }

    Object.assign(user, updates);
    user.updatedAt = Date.now();

    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: { ...user._doc, passwordHash: undefined },
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" }); // Removed details for production safety
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" }); // Removed details for production safety
  }
};
