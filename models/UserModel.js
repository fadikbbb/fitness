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
  passwordHash: {
    type: String,
    required: true,
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
    enum: ["regular", "premium", "admin"],
    default: "regular",
  },
  profileImage: {
    type: String,
  },
  subscriptionStatus: {
    type: String,
    enum: ["free", "premium"],
    default: "free",
  },
  isPremium: {
    type: Boolean,
    default: false,
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
