const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ["percent", "flat"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minCartAmount: {
      type: Number,
      default: 0,
    },

    maxDiscount: {
      type: Number,
      default: null, // Only for percent discount
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    usageLimit: {
      type: Number,
      default: null, // unlimited
    },

    usageCount: {
      type: Number,
      default: 0,
    },

    usersUsed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
