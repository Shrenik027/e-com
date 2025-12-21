const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");
const Coupon = require("../models/Coupon.model");
const mongoose = require("mongoose");

/**
 * Recalculate subtotal, discount, shipping, and total.
 */
async function recalculateCart(cart) {
  cart.subtotal = cart.items.reduce(
    (sum, it) => sum + Number(it.total || 0),
    0
  );

  let discount = 0;
  let shipping = cart.shipping || 0;

  if (cart.coupon) {
    const coupon = await Coupon.findById(cart.coupon).lean();

    if (!coupon || !coupon.isActive) {
      cart.coupon = null;
    } else {
      if (coupon.minCartAmount && cart.subtotal < coupon.minCartAmount) {
        throw Object.assign(
          new Error(
            `Coupon requires minimum purchase of ${coupon.minCartAmount}`
          ),
          { statusCode: 400 }
        );
      }

      if (coupon.discountType === "percent") {
        discount = (coupon.discountValue / 100) * cart.subtotal;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      }

      if (coupon.discountType === "fixed") {
        discount = Math.min(cart.subtotal, coupon.discountValue);
      }
    }
  }

  cart.discount = Number(discount.toFixed(2));
  cart.total = Number((cart.subtotal - cart.discount + shipping).toFixed(2));

  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}

/**
 * Add product to cart (or increase quantity).
 */
async function addToCart(userId, productId, quantity = 1) {
  const product = await Product.findById(productId).lean();
  if (!product)
    throw Object.assign(new Error("Product not found"), { statusCode: 404 });

  if (product.stock < quantity) {
    throw Object.assign(new Error("Not enough stock"), { statusCode: 400 });
  }

  let cart = await Cart.findOne({ user: userId });

  const price = Number(product.price);
  const itemTotal = Number((price * quantity).toFixed(2));

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [
        {
          product: product._id,
          name: product.name,
          priceAtAdd: price,
          quantity,
          total: itemTotal,
        },
      ],
      subtotal: itemTotal,
    });
  } else {
    const existing = cart.items.find(
      (it) => it.product.toString() === productId.toString()
    );

    if (existing) {
      const newQty = existing.quantity + quantity;

      if (product.stock < newQty)
        throw Object.assign(new Error("Not enough stock"), {
          statusCode: 400,
        });

      existing.quantity = newQty;
      existing.total = Number((existing.priceAtAdd * newQty).toFixed(2));
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        priceAtAdd: price,
        quantity,
        total: itemTotal,
      });
    }
  }

  cart.shippingMethod = null;
  cart.shipping = 0;

  await recalculateCart(cart);
  await cart.save();
  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}

/**
 * Update cart item quantity.
 */
async function updateCartItem(userId, itemId, quantity) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart)
    throw Object.assign(new Error("Cart not found"), { statusCode: 404 });

  const idx = cart.items.findIndex(
    (it) => it._id.toString() === itemId.toString()
  );

  if (idx === -1)
    throw Object.assign(new Error("Cart item not found"), { statusCode: 404 });

  if (quantity === 0) {
    cart.items.splice(idx, 1);
  } else {
    const item = cart.items[idx];
    const product = await Product.findById(item.product);
    if (!product)
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });

    if (product.stock < quantity)
      throw Object.assign(new Error("Not enough stock"), { statusCode: 400 });

    item.quantity = quantity;
    item.total = Number((item.priceAtAdd * quantity).toFixed(2));
  }

  cart.shippingMethod = null;
  cart.shipping = 0;

  await recalculateCart(cart);
  await cart.save();
  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}

/**
 * Remove cart item.
 */
async function removeCartItem(userId, itemId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart)
    throw Object.assign(new Error("Cart not found"), { statusCode: 404 });

  const idx = cart.items.findIndex(
    (it) => it._id.toString() === itemId.toString() // FIXED HERE
  );

  if (idx === -1)
    throw Object.assign(new Error("Cart item not found"), { statusCode: 404 });

  cart.items.splice(idx, 1);

  cart.shippingMethod = null;
  cart.shipping = 0;

  await recalculateCart(cart);
  await cart.save();
  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}

/**
 * Clear cart
 */
async function clearCart(userId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return null;

  cart.items = [];
  cart.coupon = null;
  cart.shippingMethod = null;
  cart.subtotal = 0;
  cart.discount = 0;
  cart.shipping = 0;
  cart.total = 0;

  await cart.save();
  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}

/**
 * Get user cart
 */
async function getCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    select: "name price stock images",
  });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
    });
  }

  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}

/**
 * Apply coupon
 */
async function applyCouponByCode(userId, code) {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon)
    throw Object.assign(new Error("Invalid coupon code"), { statusCode: 400 });

  let cart = await Cart.findOne({ user: userId });
  if (!cart)
    throw Object.assign(new Error("Cart not found"), { statusCode: 404 });

  cart.coupon = coupon._id;

  await recalculateCart(cart);
  await cart.save();

  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}
async function removeCoupon(userId) {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.coupon = null;
  cart.discount = 0;
  cart.total = cart.subtotal + cart.shipping;

  await cart.save();
  return await Cart.findById(cart._id).populate({
    path: "items.product",
    select: "name price stock images",
  });
}

module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCart,
  applyCouponByCode,
  removeCoupon,
  recalculateCart,
};
