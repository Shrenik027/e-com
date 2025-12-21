const Brand = require("../models/Brand.model");
const Product = require("../models/Product.model");
const mongoose = require("mongoose");

// Create Brand (admin)
exports.createBrand = async (req, res, next) => {
  try {
    const { name, description, logo } = req.body;

    const existing = await Brand.findOne({ name: name.trim() });
    if (existing)
      return res.status(400).json({ error: "Brand already exists" });

    const brand = await Brand.create({ name, description, logo });
    res.status(201).json({ message: "Brand created", brand });
  } catch (err) {
    next(err);
  }
};

// Get all brands (public)
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    res.json({ count: brands.length, brands });
  } catch (err) {
    next(err);
  }
};

// Get single brand
exports.getBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json(brand);
  } catch (err) {
    next(err);
  }
};

// Update brand (admin)
exports.updateBrand = async (req, res, next) => {
  try {
    const updates = req.body;
    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!brand) return res.status(404).json({ error: "Brand not found" });
    res.json({ message: "Brand updated", brand });
  } catch (err) {
    next(err);
  }
};

// Delete brand (admin) — prevent if products exist
exports.deleteBrand = async (req, res, next) => {
  try {
    const brandId = req.params.id;

    const productCount = await Product.countDocuments({ brand: brandId });
    if (productCount > 0)
      return res
        .status(400)
        .json({
          error: `Cannot delete brand: ${productCount} product(s) linked`,
        });

    const deleted = await Brand.findByIdAndDelete(brandId);
    if (!deleted) return res.status(404).json({ error: "Brand not found" });

    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    next(err);
  }
};
