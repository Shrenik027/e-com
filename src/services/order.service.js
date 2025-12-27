const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User.model");
const { adminOrderEmail } = require("../utils/emailTemplates");

async function placeOrder(userId, address) {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw Object.assign(new Error("Cart is empty"), { statusCode: 400 });
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product,
    name: item.name,
    price: item.priceAtAdd,
    quantity: item.quantity,
    total: item.total,
  }));

  const order = await Order.create({
    user: userId,
    items: orderItems,
    address,
    subtotal: cart.subtotal,
    discount: cart.discount,
    shipping: cart.shipping,
    total: cart.total,
    couponCode: cart.coupon ? String(cart.coupon) : null,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "placed",
  });

  // 🧹 Clear cart AFTER order is created
  cart.items = [];
  cart.coupon = null;
  cart.subtotal = 0;
  cart.discount = 0;
  cart.shipping = 0;
  cart.total = 0;
  cart.shippingMethod = null;
  await cart.save();

  // 📧 SEND COD ORDER EMAIL (NON-BLOCKING)
  const user = await User.findById(userId).select("email name");

  sendEmail({
    to: user.email,
    subject: `Order Placed Successfully – #${order._id}`,
    html: `
      <h2>Thanks for your order, ${user.name} 👋</h2>
      <p>Your order <strong>#${order._id}</strong> has been placed successfully.</p>
      <p><strong>Payment Method:</strong> Cash on Delivery</p>
      <p>We’ll notify you when your order is shipped.</p>
    `,
  }).catch(console.error);

  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New COD Order – #${order._id}`,
    html: adminOrderEmail({ order, user }),
  }).catch(console.error);

  return order;
}

async function getMyOrders(userId) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

async function getOrderById(orderId, userId) {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order)
    throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  return order;
}

async function getAllOrders() {
  return Order.find().populate("user", "name email").sort({ createdAt: -1 });
}

async function updateOrderStatus(orderId, newStatus) {
  const order = await Order.findById(orderId);
  if (!order)
    throw Object.assign(new Error("Order not found"), { statusCode: 404 });

  // ❌ Prevent changing terminal states
  if (["delivered", "cancelled"].includes(order.orderStatus)) {
    throw Object.assign(new Error("Order status cannot be changed"), {
      statusCode: 400,
    });
  }

  // Optional logical transitions
  const flow = {
    placed: ["confirmed", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
  };

  if (flow[order.orderStatus] && !flow[order.orderStatus].includes(newStatus)) {
    throw Object.assign(
      new Error(`Invalid transition from ${order.orderStatus}`),
      { statusCode: 400 }
    );
  }

  order.orderStatus = newStatus;
  await order.save();

  return order;
}

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
