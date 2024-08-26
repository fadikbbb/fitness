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
      passwordHash: hashedPassword, // Save hashed password
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
    res
      .status(500)
      .json({ error: "Error creating user", details: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    let filter = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete filter[field]);

    // Convert query operators to MongoDB operators
    let queryStr = JSON.stringify(filter).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    filter = JSON.parse(queryStr);

    let query = User.find(filter);

    // Sort users if specified
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Select specific fields if specified
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v"); // Exclude version key
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const users = await query;
    res.status(200).json({
      status: "200",
      result: users.length,
      data: users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching users", details: error.message });
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
    res
      .status(500)
      .json({ error: "Error fetching user", details: error.message });
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
      delete updates.password;
    }

    Object.assign(user, updates);
    user.updatedAt = Date.now();

    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: { ...user._doc, passwordHash: undefined },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error updating user", details: error.message });
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
    res
      .status(500)
      .json({ error: "Error deleting user", details: error.message });
  }
};
