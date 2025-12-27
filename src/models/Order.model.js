const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    name: String,
    price: Number,
    quantity: Number,
    total: Number,
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: String,
    city: String,
    zipCode: String,
    country: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    address: {
      type: addressSchema,
      required: true,
    },

    subtotal: Number,
    discount: Number,
    shipping: Number,
    total: Number,

    couponCode: {
      type: String,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
