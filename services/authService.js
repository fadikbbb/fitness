const { verifyRefreshToken, generateTokens } = require("../utils/tokenUtils");
const apiError = require("../utils/apiError");
const User = require("../models/UserModel");

// User Logout
exports.logout = async (user) => {
    try {
        user.isActive = false;
        await user.save();
    } catch (error) {
        throw new apiError("Error logging out user", 500);
    }
};

// Refresh Token
exports.refreshToken = async (refreshToken) => {
    try {
            if (!refreshToken) {
              throw new apiError("No refresh token provided", 401);  // Error if no refresh token is provided
            }

        const decoded = verifyRefreshToken(refreshToken);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        if (!user) {
            throw new apiError("User not found", 404);
        }

        if (!user.isActive) {
            throw new apiError("User is not active", 401);
        }
        const role = user.role;
        const { accessToken } = generateTokens(userId, role)
        return accessToken;
    } catch (error) {
        throw error;
    }
};
