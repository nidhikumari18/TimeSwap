const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["earned", "spent"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    relatedSwap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SwapRequest",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const CreditTransaction = mongoose.model(
  "CreditTransaction",
  creditTransactionSchema
);

module.exports = CreditTransaction;