const User = require("../models/UserModel");
const apiError = require("../utils/apiError");
const { hashPassword, comparePassword } = require("../utils/passwordUtils");
const { sendVerificationCodeEmail } = require("../utils/emailUtils");
const { generateTokens } = require("../utils/tokenUtils");
const { generateVerificationCode, storeVerificationCode, validateVerificationCode } = require("../utils/verificationUtils");

// Create User Service
exports.createUser = async (userData) => {
    try {
console.log(userData);
        const { email, password, firstName, lastName, gender, weight, height, dateOfBirth, role, profileImage, subscriptionStatus } = userData;

        // Hash password before saving
        const hashedPassword = await hashPassword(password);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new apiError("User already exists", 400);
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
            profileImage,
            subscriptionStatus,
        });
        await user.save();
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
            const searchRegex = new RegExp(search, 'i');
            userQuery = userQuery.where({
                $or: [
                    { name: { $regex: searchRegex } },
                ]
            });
        }

        if (sortBy) {
            const sortByFields = sortBy.split(',').join(' ');
            userQuery = userQuery.sort(sortByFields);
        }

        if (typeof fields === 'string') {
            const selectedFields = fields.split(',').join(' ');
            userQuery = userQuery.select(selectedFields);
        }

        userQuery = userQuery.skip(skip).limit(limit);

        const [users, totalUsers] = await Promise.all([
            userQuery.exec(),
            User.countDocuments(filter)
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

        if (updates.password) {
            updates.password = await hashPassword(updates.password);
        }
        if (loggedInUser._id == userIdOfUpdated && updates.role != "admin" && loggedInUser.role == "admin") {
            throw new apiError("You are not authorized to update your account from admin to user", 401);
        }
        Object.assign(user, updates);
        user.updatedAt = Date.now();
        await user.save();
        return user;
    } catch (error) {
        throw error;
    }
};

// Update user password
exports.updatePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
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
        const user = await User.findById(userId);
        if (!user) throw new apiError("User not found", 404);

        const userNutritionPlans = await UserNutritionPlan.find({ userId: userId });
        if (userNutritionPlans) {
            await UserNutritionPlan.deleteMany({ userId: userId });
        }
        
        const userWorkouts = await UserWorkout.find({ userId: userId });
        if (userWorkouts) {
            await UserWorkout.deleteMany({ userId: userId });
        }

        await user.remove();
        return user;
    } catch (error) {
        throw error;
    }
};

// Register a new user
exports.register = async (email, password, firstName, lastName) => {
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new apiError("Email already exists", 400);
        }

        // Generate a new verification code
        const verificationCode = generateVerificationCode();
        console.log(`Generated verification code for ${email}: ${verificationCode}`);

        // Store the verification code
        storeVerificationCode(email, verificationCode);

        // Send the verification code to the user's email
        await sendVerificationCodeEmail(email, verificationCode);

        return { message: "success" };
    } catch (error) {
        throw error;
    }
};


// Login user and send verification code
exports.login = async (email, password) => {
    try {
        // Retrieve the user and verify the password

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new apiError("Invalid email or password", 400);
        }

        // Compare the provided password
        console.log(password, user.password);
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new apiError("Invalid email or password", 400);
        }

        // Generate a new verification code
        const verificationCode = generateVerificationCode();

        // Store the verification code
        storeVerificationCode(email, verificationCode);

        // Send the verification code to the user's email
        await sendVerificationCodeEmail(email, verificationCode);

        return { message: "login success" };
    } catch (error) {
        throw error;
    }
};


// Validate the user's verification code
exports.verifyCode = async (email, password, firstName, lastName, purpose, code) => {
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

            const isPasswordValid = await comparePassword(password, userValidate.password);
            if (!isPasswordValid) {
                throw new apiError("Invalid email or password", 400);
            }

            if (!validateVerificationCode(email, code)) {
                throw new apiError("Invalid or expired verification code", 400);
            }

            const { accessToken, refreshToken } = generateTokens(userValidate._id, userValidate.role);
            userValidate.isActive = true;
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
            const user = new User({ email, password: hashedPassword, firstName, lastName });
            await user.save();

            return { message: "success" };
        }
    } catch (error) {
        throw error;
    }
};
