const userService = require("../services/userService");
const { generateTokens } = require("../utils/tokenUtils");

// Create User
exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ isSuccess: true, message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

// Get All Users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { users, totalUsers } = await userService.getAllUsers(
      req.filter,
      req.search,
      req.sortBy,
      req.fields,
      req.page,
      req.limit);
    res.status(200).json({ isSuccess: true, users: users, totalUsers: totalUsers });
  } catch (error) {
    next(error);
  }
};

// Get User By ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({ isSuccess: true, message: "User fetched successfully", user });
  } catch (error) {
    next(error);
  }
};

// Update User
exports.updateUser = async (req, res, next) => {
  const loggedInUser=req.user;
  try {
    const user = await userService.updateUser(req.params.id,loggedInUser, req.body);
console.log(user);
    res.status(200).json({
      isSuccess: true,
      message: "User updated successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    next(error);
  }
};

// Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({ isSuccess: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Update Password
exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await userService.updatePassword(req.user._id, oldPassword, newPassword, confirmPassword);

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
    });

    res.status(200).json({ isSuccess: true, token: accessToken, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};