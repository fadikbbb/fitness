const User = require("../models/UserModel");
const multer = require('multer');
const path = require('path');
const {generateTokens} = require("../utils/tokenUtils");
const {hashPassword, comparePassword} = require("../utils/passwordUtils");
// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Set your desired upload directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Add a timestamp to the file name
  },
});

const upload = multer({ storage: storage }).single('profileImage');

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
    const hashedPassword = await hashPassword(password);

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
    if ( req.body.email !== req.user.email) {
      return res.status(401).json({ error: "you can't update your email" });
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "can't update your profile" });
    }

    if (updates.password) {
      // Hash the new password before updating
      updates.passwordHash = await hashPassword(updates.password);
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
    res.status(500).json({ error: "Error updating user", details: error.message }); // Removed details for production safety
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

// Update Password
exports.updatePassword = async (req, res) => {
  console.log(req.body)
  try {
    const { oldPassword,confirmPassword, newPassword } = req.body;
    if (!oldPassword || !confirmPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Verify old password
    const isMatch = await comparePassword(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid current password" });
    }
    if(newPassword === oldPassword){
      return res.status(400).json({ error: "Passwords can't be the like current password" });
    }
    console.log(req.body)
    if (confirmPassword !== newPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    // Update user password
    user.passwordHash = hashedPassword;
    user.updatedAt = Date.now();
    user.passwordChangedAt = Date.now();
    await user.save();
console.log(user._id)
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken: accessToken,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error updating password",
      details: error.message,
    });
  }
};
