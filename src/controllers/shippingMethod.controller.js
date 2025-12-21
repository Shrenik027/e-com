const ShippingMethod = require("../models/ShippingMethod.model");

// Create shipping method (admin)
exports.createShippingMethod = async (req, res, next) => {
  try {
    const existing = await ShippingMethod.findOne({
      name: req.body.name.trim(),
    });

    if (existing) {
      return res.status(400).json({ error: "Shipping method already exists" });
    }

    const method = await ShippingMethod.create(req.body);

    res.status(201).json({
      message: "Shipping method created",
      method,
    });
  } catch (error) {
    next(error);
  }
};

// Get all methods (public)
exports.getShippingMethods = async (req, res, next) => {
  try {
    const methods = await ShippingMethod.find({ isActive: true }).sort({
      price: 1,
    });
    res.json({ count: methods.length, methods });
  } catch (error) {
    next(error);
  }
};

// Get single method
exports.getShippingMethod = async (req, res, next) => {
  try {
    const method = await ShippingMethod.findById(req.params.id);
    if (!method)
      return res.status(404).json({ error: "Shipping method not found" });

    res.json(method);
  } catch (error) {
    next(error);
  }
};

// Update (admin)
exports.updateShippingMethod = async (req, res, next) => {
  try {
    const updated = await ShippingMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Shipping method not found" });

    res.json({ message: "Shipping method updated", updated });
  } catch (error) {
    next(error);
  }
};

// Delete (admin)
exports.deleteShippingMethod = async (req, res, next) => {
  try {
    const deleted = await ShippingMethod.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ error: "Shipping method not found" });

    res.json({ message: "Shipping method deleted" });
  } catch (error) {
    next(error);
  }
};
