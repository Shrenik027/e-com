const cartService = require("../services/cart.service");
const Coupon = require("../models/Coupon.model");
const Cart = require("../models/Cart.model");
const ShippingMethod = require("../models/ShippingMethod.model");
const mongoose = require("mongoose");

// Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(
      req.user.id,
      req.body.productId,
      req.body.quantity || 1
    );
    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    next(err);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.json({ cart });
  } catch (err) {
    next(err);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItem(
      req.user.id,
      req.params.itemId,
      req.body.quantity
    );
    res.json({ message: "Cart updated", cart });
  } catch (err) {
    next(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.removeCartItem(
      req.user.id,
      req.params.itemId
    );
    res.json({ message: "Item removed", cart });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user.id);
    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    next(err);
  }
};

// Apply coupon
exports.applyCoupon = async (req, res, next) => {
  try {
    const cart = await cartService.applyCouponByCode(
      req.user.id,
      req.body.code
    );
    res.json({ message: "Coupon applied", cart });
  } catch (err) {
    next(err);
  }
};

exports.removeCoupon = async (req, res, next) => {
  const cart = await cartService.removeCoupon(req.user.id);
  res.json({ cart });
};

// NEW — Apply Shipping Method
exports.applyShippingMethod = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { shippingMethodId } = req.body;

    if (!mongoose.isValidObjectId(shippingMethodId)) {
      return res.status(400).json({ error: "Invalid shipping method ID" });
    }

    const method = await ShippingMethod.findById(shippingMethodId);
    if (!method || !method.isActive) {
      return res.status(404).json({ error: "Shipping method not found" });
    }

    let cart = await Cart.findOne({ user: userId }).populate(
      "items.product coupon"
    );

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.shipping = method.price;
    cart.shippingMethod = method._id;

    cart.total = cart.subtotal - cart.discount + cart.shipping;

    await cart.save();

    res.json({
      message: "Shipping method applied",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
