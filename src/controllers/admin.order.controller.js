const Order = require("../models/Order.model");
const { ORDER_STATUS_FLOW } = require("../constants/orderStatus");

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET SINGLE ORDER (ADMIN)
========================= */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE ORDER STATUS
   (YOUR EXISTING LOGIC)
========================= */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 🔒 locked states
    if (["delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        error: "Order is already finalized",
      });
    }

    const currentIndex = ORDER_STATUS_FLOW.indexOf(order.orderStatus);
    const nextIndex = ORDER_STATUS_FLOW.indexOf(status);

    // ❌ invalid jump
    if (nextIndex !== currentIndex + 1 && status !== "cancelled") {
      return res.status(400).json({
        error: "Invalid order status transition",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    next(err);
  }
};
