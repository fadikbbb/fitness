const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");

// Import utility functions
const {
  generateTokens,
  generatePasswordResetToken,
  verifyRefreshToken,
} = require("../utils/tokenUtils");

const {
  sendPasswordResetEmail,
  sendVerificationCodeEmail,
} = require("../utils/emailUtils");

// In-memory storage for verification codes (You may choose to use a database for persistence)
const verificationCodes = new Map();

// User Registration
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

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create and save new user
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
    res
      .status(500)
      .json({ error: "Error creating user", details: error.message });
  }
};

// Send verification code to user's email
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a 6-digit random verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Store the verification code with expiration time (5 minutes)
    verificationCodes.set(email, {
      code: verificationCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
    });

    // Send the verification code to the user's email
    await sendVerificationCodeEmail(email, verificationCode);

    // Inform user that a verification code has been sent
    res.status(200).json({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in", details: error.message });
  }
};

// Verify login code
exports.verifyLoginCode = async (req, res) => {
  try {
    const { email, code, password } = req.body;

    // Validate input
    if (!email || !code || !password) {
      return res
        .status(400)
        .json({ error: "Email, verification code, and password are required" });
    }

    // Retrieve the user and verify the password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Retrieve the stored verification code
    const storedCodeData = verificationCodes.get(email);
    // Check if the code is correct and not expired
    if (
      !storedCodeData ||
      storedCodeData.code !== code ||
      storedCodeData.expiresAt < Date.now()
    ) {
      return res
        .status(401)
        .json({ error: "Invalid or expired verification code" });
    }

    // Clear the stored verification code
    verificationCodes.delete(email);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send access token in response
    res.json({ accessToken: accessToken });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error verifying code", details: error.message });
  }
};

// Resend verification code endpoint
exports.resendCode = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate a new verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Store the new verification code with expiration time
    verificationCodes.set(email, {
      code: verificationCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
    });

    // Send the verification code to the user's email
    await sendVerificationCodeEmail(email, verificationCode);

    res.status(200).json({ message: "Verification code sent to your email" });
  } catch (error) {
    res.status(500).json({
      error: "Error resending verification code",
      details: error.message,
    });
  }
};

// Refresh Token
exports.refreshToken = (req, res) => {
  try {
    const { refreshToken } = req.cookies; // Retrieve the refresh token from cookies

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token is required" });
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken); // Verify the token
    const userId = decoded.userId;

    // Generate a new access token
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.EXPIRES_IN_ACCESS, // Access token expiration time
    });

    res.json({ accessToken });
  } catch (error) {
    console.error("Error refreshing token:", error.message); // Log the error
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// User Logout
exports.logout = async (req, res) => {
  // Clear the refresh token in HttpOnly cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  // Clear the access token in the Authorization header
  res.header("Authorization", "");

  // Change User status to not active
  const user = req.user;
  user.isActive = false;
  await user.save();

  // Send a success message
  res.status(200).json({ message: "Logged out successfully" });
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = generatePasswordResetToken(user._id);
    await sendPasswordResetEmail(user.email, resetToken);
    user.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();
    // Send password reset email
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({
      error: "Error requesting password reset",
      details: error.message,
    });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body; // Only expect newPassword from body
    const { token: resetToken } = req.params; // Extract resetToken from URL parameters

    // Validate input
    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ error: "Reset token and new password are required" });
    }

    // Verify the reset token
    const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.passwordResetExpires < Date.now()) {
      return res.status(400).json({ error: "Reset token has expired" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password

    user.passwordHash = hashedPassword;
    user.updatedAt = Date.now();
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error resetting password", details: error.message });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const isMatch = await comparePassword(oldPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid old password" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    user.passwordHash = hashedPassword;
    user.updatedAt = Date.now();
    user.passwordChangedAt = Date.now();
    await user.save();

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
