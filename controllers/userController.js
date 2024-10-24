const userService = require("../services/userService");
const { generateTokens } = require("../utils/tokenUtils");

// Create User
exports.createUser = async (req, res, next) => {
  try {
    const create = req.body;
    create.image = req.files["image"] ? req.files["image"][0] : null;
    const user = await userService.createUser(create);
    res
      .status(201)
      .json({ isSuccess: true, message: "User created successfully", user });
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
      req.limit
    );
    res
      .status(200)
      .json({ isSuccess: true, users: users, totalUsers: totalUsers });
  } catch (error) {
    next(error);
  }
};

// Get User By ID
exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    res
      .status(200)
      .json({ isSuccess: true, message: "User fetched successfully", user });
  } catch (error) {
    next(error);
  }
};

// Update User
exports.updateUser = async (req, res, next) => {
  const loggedInUser = req.user;
  const { userId } = req.params;
  const updates = req.body;
  if (req.files) {
    updates.image = req.files["image"] ? req.files["image"][0] : null;
  }
  try {
    const user = await userService.updateUser(userId, loggedInUser, updates);
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
    const { userId } = req.params;
    await userService.deleteUser(userId);
    res
      .status(200)
      .json({ isSuccess: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Update Password
exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await userService.updatePassword(
      req.user._id,
      oldPassword,
      newPassword,
      confirmPassword
    );
    const { accessToken, refreshToken } = generateTokens(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: process.env.REFRESH_TOKEN_MAX_AGE,
    });
    res.status(200).json({
      isSuccess: true,
      token: accessToken,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
