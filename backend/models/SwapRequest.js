const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    skillTheyTeach: {
      type: String,
      required: true,
      trim: true,
    },

    skillTheyWant: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const SwapRequest = mongoose.model(
  "SwapRequest",
  swapRequestSchema
);

module.exports = SwapRequest;