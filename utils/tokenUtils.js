const jwt = require("jsonwebtoken");

// Function to generate access and refresh tokens
const generateTokens = (userId) => {
  try {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      throw new Error("JWT secrets are not defined in environment variables");
    }

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.EXPIRES_IN_ACCESS, // 15 minutes
    });

    const refreshToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.EXPIRES_IN_REFRESH, // 7 days
      }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(`Error generating tokens: ${error.message}`);
  }
};


// Function to generate a password reset token
const generatePasswordResetToken = (userId) => {
  try {
    if (!process.env.RESET_TOKEN_SECRET) {
      throw new Error(
        "RESET_TOKEN_SECRET is not defined in environment variables"
      );
    }
    
    // Generate a token for password reset, valid for 1 hour
    return jwt.sign({ userId }, process.env.RESET_TOKEN_SECRET, {
      expiresIn: process.env.EXPIRES_IN_RESET,
    });
  } catch (error) {
    throw new Error(`Error generating password reset token: ${error.message}`);
  }
};

// Function to verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};

module.exports = { generateTokens, generatePasswordResetToken,verifyRefreshToken };
