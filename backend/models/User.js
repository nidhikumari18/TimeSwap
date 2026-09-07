const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC USER INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },
    
    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // ==========================================
    // PROFILE
    // ==========================================

    profilePicture: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    // ==========================================
    // SKILLS
    // ==========================================

    skillsToTeach: {
      type: [String],
      default: [],
    },

    skillsToLearn: {
      type: [String],
      default: [],
    },

    // ==========================================
    // REPUTATION
    // ==========================================

    rating: {
      type: Number,
      default: 0,
    },

    totalSwaps: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // 💰 TIME CREDITS
    // ==========================================

    credits: {
      type: Number,
      default: 3,
      min: 0,
    },

    totalCreditsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalCreditsSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
  },

  // ==========================================
  // TIMESTAMPS
  // ==========================================

  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;