const Coupon = require("../models/Coupon.model");
const Cart = require("../models/Cart.model");

// ======================
// Create Coupon (Admin)
// ======================
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ message: "Coupon created", coupon });
  } catch (err) {
    next(err);
  }
};

// ======================
// Apply Coupon to Cart
// ======================
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) return res.status(400).json({ error: "Invalid coupon code" });

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ error: "Coupon expired" });
    }

    let cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    if (coupon.minCartAmount && cart.subtotal < coupon.minCartAmount) {
      return res.status(400).json({
        error: `Cart must be at least ₹${coupon.minCartAmount}`,
      });
    }

    // Calculate discount
    let discount = 0;

    if (coupon.discountType === "percent") {
      discount = (coupon.discountValue / 100) * cart.subtotal;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    // Apply coupon (IMPORTANT FIX HERE)
    cart.coupon = coupon._id;
    cart.discount = discount;
    cart.total = cart.subtotal - discount;

    await cart.save();

    res.json({
      message: "Coupon applied successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

// ======================
// Remove Coupon
// ======================
exports.removeCoupon = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.discount = 0;
    cart.coupon = null;
    cart.total = cart.subtotal + cart.shipping;

    await cart.save();

    res.json({ message: "Coupon removed", cart });
  } catch (err) {
    next(err);
  }
};

/* ==========================
   GET ALL COUPONS (ADMIN)
========================== */
exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (err) {
    next(err);
  }
};

/* ==========================
   DELETE COUPON (ADMIN)
========================== */
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.couponId);

    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted" });
  } catch (err) {
    next(err);
  }
};
