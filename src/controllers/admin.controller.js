const Order = require("../models/Order.model");
const User = require("../models/User.model");
const Product = require("../models/Product.model");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, totalProducts, recentOrders] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments(),
        Product.countDocuments(),
        Order.find()
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totals: {
        orders: totalOrders,
        users: totalUsers,
        products: totalProducts,
        revenue: revenueAgg[0]?.total || 0,
      },
      orderStatusStats,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};

/* ==========================
   GET ALL USERS
========================== */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

/* ==========================
   GET SINGLE USER
========================== */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

/* ==========================
   TOGGLE BLOCK / UNBLOCK
========================== */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: user.isActive ? "User unblocked" : "User blocked",
      user,
    });
  } catch (err) {
    next(err);
  }
};

/* ==========================
   UPDATE USER ROLE
========================== */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true }
    ).select("-password");

    res.json({
      message: "User role updated",
      user,
    });
  } catch (err) {
    next(err);
  }
};

/* ==========================
   GET USER ORDERS
========================== */
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};
