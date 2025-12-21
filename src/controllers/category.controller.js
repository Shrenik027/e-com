const Category = require("../models/Category.model");
const Product = require("../models/Product.model");
const mongoose = require("mongoose");

// Create Category (admin)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parent } = req.body;

    // optional parent validation
    if (parent) {
      if (!mongoose.isValidObjectId(parent))
        return res.status(400).json({ error: "Invalid parent category id" });

      const parentCat = await Category.findById(parent);
      if (!parentCat)
        return res.status(400).json({ error: "Parent category not found" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Category with this name already exists" });
    }

    const category = await Category.create({
      name,
      description,
      image,
      parent: parent || null,
    });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    next(err);
  }
};

// Get all categories (public)
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ count: categories.length, categories });
  } catch (err) {
    next(err);
  }
};

// Get single category by id
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// Update category (admin)
exports.updateCategory = async (req, res, next) => {
  try {
    const updates = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category updated", category });
  } catch (err) {
    next(err);
  }
};

// Delete category (admin) — prevent if products exist
exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    // check products that reference this category
    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category: ${productCount} product(s) are linked to this category`,
      });
    }

    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
