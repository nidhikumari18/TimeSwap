const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    swapRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skill: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    credits: {
      type: Number,
      required: true,
      min: 1,
    },

    scheduledAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["scheduled", "active", "completed", "cancelled"],
      default: "scheduled",
    },

    creditsTransferred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;