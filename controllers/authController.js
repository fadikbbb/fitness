const userService = require("../services/userService");
const authService = require("../services/authService");
const passwordService = require("../services/passwordService");

exports.register = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await userService.register(email);
        res.status(200).json({ isSuccess: true, message: result.message });
    } catch (error) {
        next(error)
    }
};
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        res.status(200).json({ isSuccess: true, message: result.message });
    } catch (error) {
        next(error)
    }
};

exports.verifyCode = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, purpose, code } = req.body;
        const result = await userService.verifyCode(email, password, firstName, lastName, purpose, code);

        if (purpose === "login") {
            const { accessToken, refreshToken } = result;
            const refreshTokenMaxAge = process.env.REFRESH_TOKEN_MAX_AGE
                ? Number(process.env.REFRESH_TOKEN_MAX_AGE)
                : 7 * 24 * 60 * 60 * 1000;
            const expiresDate = refreshTokenMaxAge;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "Strict" : "lax",
                expires: expiresDate,
                maxAge: refreshTokenMaxAge
            });

            res.status(200).json({ isSuccess: true, message: result.message, token: accessToken });
        } else {
            res.status(200).json(result);
        }
    } catch (error) {
        next(error);
    }
};
exports.logout = async (req, res, next) => {
    try {
        const user = req.user;
        await authService.logout(user);
        res.clearCookie("refreshToken");
        res.set("Authorization", "");
        res.status(200).json({ isSuccess: true, message: "Logged out successfully" });
    } catch (error) {
        next(error)
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const accessToken = await authService.refreshToken(refreshToken);
        res.status(200).json({ isSuccess: true, accessToken });
    } catch (error) {
        next(error)
    }
};
exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await passwordService.requestPasswordReset(email);

        res.status(200).json({ isSuccess: true, message: result.message });
    } catch (error) {
        next(error)
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const resetToken = req.params.token;
        const { password, confirmPassword } = req.body;
        const result = await passwordService.resetPassword(resetToken, password, confirmPassword);
        res.status(200).json({ isSuccess: true, message: result });
    } catch (error) {
        next(error)
    }
};
