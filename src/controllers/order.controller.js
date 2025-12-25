const orderService = require("../services/order.service");

exports.placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    const order = await orderService.placeOrder(userId, address);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user.id);
    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.orderId,
      req.user.id
    );
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const allowed = [
      "placed",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowed.includes(orderStatus)) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await orderService.updateOrderStatus(
      req.params.orderId,
      orderStatus
    );

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderByIdAdmin = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("user", "name email")
      .populate("items.product", "name");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};
