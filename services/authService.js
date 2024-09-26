const { verifyRefreshToken, generateTokens } = require("../utils/tokenUtils");
const apiError = require("../utils/apiError");

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
exports.refreshToken = (refreshToken) => {
    try {
        console.log(refreshToken);
        const decoded = verifyRefreshToken(refreshToken);
        const userId = decoded.userId;
        const { accessToken } = generateTokens(userId)
        return { accessToken };
    } catch (error) {
        next(error);
    }
};
