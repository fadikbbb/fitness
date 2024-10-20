const User = require("../models/UserModel");
const apiError = require("../utils/apiError");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { sendVerificationCodeEmail } = require("../utils/emailUtils");
const { generateTokens } = require("../utils/tokenUtils");
const {
  generateVerificationCode,
  storeVerificationCode,
  validateVerificationCode,
} = require("../utils/verificationUtils");
const UserNutritionPlan = require("../models/NutritionPlanModel");
const UserWorkoutPlan = require("../models/WorkoutPlanModel");
const Comment = require("../models/CommentModel");
const {
  updateFile,
  uploadToStorage,
  deleteFile,
} = require("../utils/uploadUtils");
// Create User Service
exports.createUser = async (userData) => {
  try {
    let {
      email,
      password,
      firstName,
      lastName,
      gender,
      weight,
      height,
      dateOfBirth,
      role,
      image,
      subscriptionStatus,
    } = userData;

    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new apiError("User already exists", 400);
    }

    if (image) {
      image = await uploadToStorage(
        image.originalname,
        image.mimetype,
        image.buffer,
        "img"
      );
    }

    // Create a new user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      weight,
      height,
      dateOfBirth,
      role,
      image,
      subscriptionStatus,
    });

    // Save the user to the database
    await user.save();

    // Create an empty nutrition plan
    const nutritionPlan = new UserNutritionPlan({
      userId: user._id,
      meals: [],
      totalCalories: 0,
    });
    await nutritionPlan.save();

    const workoutPlan = new UserWorkoutPlan({
      userId: user._id,
      days: [],
    });

    await workoutPlan.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Get all users
exports.getAllUsers = async (filter, search, sortBy, fields, page, limit) => {
  try {
    const skip = Math.max(0, (page - 1) * limit);

    let userQuery = User.find(filter);

    if (search) {
      const searchRegex = new RegExp(search, "i");
      userQuery = userQuery.find({
        $or: [
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", " ", "$lastName"] },
                regex: search,
                options: "i",
              },
            },
          },
        ],
      });
    }

    if (sortBy) {
      const sortByFields = sortBy.split(",").join(" ");
      userQuery = userQuery.sort(sortByFields);
    }

    if (typeof fields === "string") {
      const selectedFields = fields.split(",").join(" ");
      userQuery = userQuery.select(selectedFields);
    }

    userQuery = userQuery.skip(skip).limit(limit);

    const [users, totalUsers] = await Promise.all([
      userQuery.exec(),
      User.countDocuments(filter), // Count documents based on the updated filter
    ]);

    return { totalUsers, users };
  } catch (error) {
    throw error;
  }
};

// Get user by ID
exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new apiError("User not found", 404);
    return user;
  } catch (error) {
    throw error;
  }
};

// Update user details
exports.updateUser = async (userIdOfUpdated, loggedInUser, updates) => {
  try {
    if (!Object.keys(updates).length) {
      throw new apiError("No data provided", 400);
    }
    const user = await User.findById(userIdOfUpdated);
    if (!user) throw new apiError("User not found", 404);
    if (updates.image) {
      updates.image = await updateFile(
        user.image,
        updates.image.originalname,
        updates.image.mimetype,
        updates.image.buffer,
        "img"
      );
    } else {
      updates.image = user.image;
    }

    if (user.role === "admin") {
      if (updates.isActive === false) {
        throw new apiError("You are not authorized to block your account", 401);
      }
    }
    updates.email = user.email;
    Object.assign(user, updates);
    user.updatedAt = Date.now();
    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Update user password
exports.updatePassword = async (
  userId,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await User.findById(userId).select("+password");
    if (!user) throw new apiError("User not found", 404);

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new apiError("All fields are required", 400);
    }

    if (newPassword !== confirmPassword) {
      throw new apiError("Passwords do not match", 400);
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) throw new apiError("Invalid current password", 400);

    user.password = await hashPassword(newPassword);
    user.updatedAt = Date.now();
    user.passwordChangedAt = Date.now();

    await user.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// Delete user
exports.deleteUser = async (userId) => {
  try {
    let user = await User.findById(userId);
    if (!user) throw new apiError("User not found", 404);

    if (user.role == "admin") {
      throw new apiError("You are not authorized to delete Your account", 401);
    }

    const userNutritionPlans = await UserNutritionPlan.find({ userId: userId });
    if (userNutritionPlans) {
      await UserNutritionPlan.deleteOne({ userId: userId });
    }

    const userWorkouts = await UserWorkoutPlan.find({ userId: userId });
    if (userWorkouts) {
      await UserWorkoutPlan.deleteOne({ userId: userId });
    }

    const userComments = await Comment.find({ userId: userId });
    if (userComments) {
      await Comment.deleteMany({ userId: userId });
    }

    if (user.image) {
      await deleteFile(user.image);
    }

    user = await User.findByIdAndDelete(userId);
    if (!user) throw new apiError("User not found", 404);
    return user;
  } catch (error) {
    throw error;
  }
};

// Register a new user
exports.register = async (email, password, firstName, lastName) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new apiError("Email already exists", 400);
    }
    const verificationCode = generateVerificationCode();
    console.log(verificationCode);
    storeVerificationCode(email, verificationCode);
    await sendVerificationCodeEmail(email, verificationCode);
    return { message: "success" };
  } catch (error) {
    throw error;
  }
};

// Login user and send verification code
exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new apiError("Invalid email or password", 400);
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new apiError("Invalid email or password", 400);
    }
    const verificationCode = generateVerificationCode();
    storeVerificationCode(email, verificationCode);
    await sendVerificationCodeEmail(email, verificationCode);
    return { message: "login success" };
  } catch (error) {
    throw error;
  }
};

// Validate the user's verification code
exports.verifyCode = async (
  email,
  password,
  firstName,
  lastName,
  purpose,
  code
) => {
  try {
    if (!email || !password) {
      throw new apiError("Email and password are required", 400);
    }
    if (code === undefined) {
      const verificationCode = generateVerificationCode();
      storeVerificationCode(email, verificationCode);
      await sendVerificationCodeEmail(email, verificationCode);
      return { message: "Resent verification code" };
    }

    const userValidate = await User.findOne({ email }).select("+password");

    if (purpose === "login") {
      if (!userValidate) {
        throw new apiError("Create an account first", 400);
      }
      const isPasswordValid = await comparePassword(
        password,
        userValidate.password
      );
      if (!isPasswordValid) {
        throw new apiError("Invalid email or password", 400);
      }
      if (!validateVerificationCode(email, code)) {
        throw new apiError("Invalid or expired verification code", 400);
      }
      const { accessToken, refreshToken } = generateTokens(
        userValidate._id,
        userValidate.role
      );
      await userValidate.save();
      return { message: "login success", accessToken, refreshToken };
    } else if (purpose === "register") {
      if (userValidate) {
        throw new apiError("You have been registered before", 400);
      }
      if (!validateVerificationCode(email, code)) {
        throw new apiError("Invalid or expired verification code", 400);
      }
      const hashedPassword = await hashPassword(password);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      await user.save();
      return { message: "success" };
    }
  } catch (error) {
    throw error;
  }
};
