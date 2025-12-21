const Product = require("../models/Product.model");
const { uploadToCloudinary } = require("../utils/fileHelper");
const mongoose = require("mongoose");

// Create Product (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    let imageObjs = [];

    if (req.files && req.files.length > 0) {
      const uploads = req.files.map((file) => uploadToCloudinary(file.buffer));
      const results = await Promise.all(uploads);

      imageObjs = results; // Already { url, publicId }
    }

    const productData = {
      ...req.body,
      images: imageObjs,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Get Products (with filters)
exports.getProducts = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.category && mongoose.isValidObjectId(req.query.category)) {
      query.category = req.query.category;
    }
    if (req.query.brand && mongoose.isValidObjectId(req.query.brand)) {
      query.brand = req.query.brand;
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const sort = {};
    if (req.query.sort) {
      sort[req.query.sort] = req.query.order === "desc" ? -1 : 1;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate("category brand")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Product
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      "category brand"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};
