const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");

/* =========================
   ADMIN DASHBOARD
========================= */
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      revenueAgg,
      orderStatusStats,
      recentOrders,
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),

      // 💰 Revenue
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),

      // 📦 Order status
      Order.aggregate([
        { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
      ]),

      // 🕒 Recent orders
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("total orderStatus paymentStatus createdAt"),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      orderStatusStats,
      recentOrders,
    });
  } catch (err) {
    next(err);
  }
};
