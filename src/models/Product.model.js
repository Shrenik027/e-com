const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }, // optional if you want to delete later
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: { type: Number, required: [true, "Product price is required"] },
    stock: { type: Number, required: true, default: 0 },

    images: { type: [imageSchema], default: [] },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true, // set to false if you want it optional during dev
    },

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true, // set to false if you want it optional during dev
    },

    discount: { type: Number, min: 0, max: 100, default: 0 },

    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
