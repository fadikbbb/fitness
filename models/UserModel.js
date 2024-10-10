const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^[a-zA-Z0-9_.+]*[a-zA-Z][a-zA-Z0-9_.+]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: false,
  },
  weight: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  image: {
    type: String,
  },
  subscriptionStatus: {
    type: String,
    enum: ["free", "premium"],
    default: "free",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
