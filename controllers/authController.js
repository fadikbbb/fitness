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
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ path: "email", error: "Email already exists" });
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

    res.status(200).json({ message: "success" });

  } catch (error) {
    res
      .status(500)
      .json({ error: "Error creating user", details: error.message });
  }
};

//  login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    // Retrieve the user and verify the password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
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
    
    res.status(200).json({ message: "success" });
  } catch (error) {

    res
      .status(500)
      .json({ error: "Error verifying code", details: error.message });
  }
};


// User Logout
exports.logout = async (req, res) => {
  try {
    // Clear the refresh token in HttpOnly cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true, // Ensure secure is set to true in production
      sameSite: "Strict", // Helps prevent CSRF attacks
    });

    // Clear the access token in the Authorization header
    res.set("Authorization", "");

    // Change user status to inactive
    const user = req.user; // Assuming middleware has added user to req
    user.isActive = false;
    await user.save();

    // Send a success message
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed", details: error.message });
  }
};

// send verification code endpoint
exports.verifyCode = async (req, res) => {

  try {
    const {
      email,
      firstName,
      lastName,
      password,
      purpose,
      code
    } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userValidate = await User.findOne({ email });
    if (purpose === "login") {

      if (!userValidate) {
        return res.status(404).json({ error: "create an account first" });
      }

      // Retrieve the stored verification code
      const storedCodeData = verificationCodes.get(email);

      if (!storedCodeData) {
        return res.status(401).json({ error: "login first" });
      }

      // Check if the code is correct and not expired
      if (storedCodeData.code !== code || storedCodeData.expiresAt < Date.now()) {
        return res
          .status(401)
          .json({ error: "Invalid or expired verification code" });
      }

      // Clear the stored verification code
      verificationCodes.delete(email);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(userValidate._id);

      // Store refresh token in HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      userValidate.isActive = true;
      await userValidate.save();
      // Send access token in response
      return res.status(200).json({ message: "logged in successfully", token: accessToken });

    } else if (purpose === "register") {

      if (userValidate) {
        return res.status(409).json({ error: "you have been registered before" });
      }
      // Retrieve the stored verification code
      const storedCodeData = verificationCodes.get(email);
      if (!storedCodeData) {
        return res.status(401).json({ error: "register first" });
      }

      // Check if the code is correct and not expired
      if (storedCodeData.code !== code || storedCodeData.expiresAt < Date.now()) {
        return res
          .status(401)
          .json({ error: "Invalid or expired verification code" });
      }

      // Clear the stored verification code
      verificationCodes.delete(email);
      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create and save new user
      const user = new User({
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
      });

      await user.save();

      return res.status(200).json({ message: "registered successfully" });
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

    res.status(200).json({ message: "resended verification code" });

  } catch (error) {
    res.status(500).json({
      error: "Error resending verification code",
      details: error.message,
    });
  }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "you don't have an account" });
    }

    const resetToken = generatePasswordResetToken(user._id); // Token generator function
    user.passwordResetToken = resetToken; // Store token in DB for validation later
    user.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours
    await user.save();

    await sendPasswordResetEmail(user.email, resetToken); // Function to send reset email

    res.status(200).json({ message: "check your email" });
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
    const { password, confirmPassword } = req.body;
    const resetToken = req.params.token;

    // Validate input
    if (!resetToken || !password || !confirmPassword) {
      return res.status(400).json({
        error: "New password, and confirm password are required",
      });
    }

    // Check if newPassword and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Verify the reset token
    const decoded = jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET); // Adjust your token verification method
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Invalid email" });
    }

    // Check if token has expired
    if (user.passwordResetExpires < Date.now() || user.passwordResetToken !== resetToken) {
      return res.status(400).json({ error: "Reset password email expired" });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user password and reset fields
    user.passwordHash = hashedPassword;
    user.passwordResetToken = undefined; // Clear reset token after use
    user.passwordResetExpires = undefined; // Clear expiration after use
    user.passwordChangedAt = Date.now();

    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error resetting password", details: error.message });
    console.log(error)
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