const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    priceAtAdd: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    total: { type: Number, required: true },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    items: { type: [cartItemSchema], default: [] },

    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    shippingMethod: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ShippingMethod",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
