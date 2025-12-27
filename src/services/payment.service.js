const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment.model");
const Order = require("../models/Order.model");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User.model");
const { adminOrderEmail } = require("../utils/emailTemplates");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createPayment = async (userId, orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw Object.assign(new Error("Order not found"), { statusCode: 404 });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100), // ₹ → paise
    currency: "INR",
    receipt: order._id.toString(),
  });

  const payment = await Payment.create({
    user: userId,
    order: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: order.total,
    status: "created",
  });

  return {
    razorpayOrder,
    paymentId: payment._id,
  };
};

exports.verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw Object.assign(new Error("Invalid signature"), { statusCode: 400 });
  }

  const payment = await Payment.findOne({
    razorpayOrderId: razorpay_order_id,
  });

  if (!payment) {
    throw Object.assign(new Error("Payment not found"), { statusCode: 404 });
  }

  // ✅ IDPOTENCY
  if (payment.status === "paid") {
    return {
      payment,
      order: await Order.findById(payment.order),
    };
  }

  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  payment.status = "paid";
  await payment.save();

  const order = await Order.findById(payment.order);
  const user = await User.findById(payment.user).select("email name");

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  await order.save();

  // 📧 USER EMAIL (NOW FIXED)
  sendEmail({
    to: user.email,
    subject: `Payment Successful – Order #${order._id}`,
    html: `
      <h2>Payment Successful 🎉</h2>
      <p>Your payment for order <strong>#${order._id}</strong> has been confirmed.</p>
    `,
  }).catch(console.error);

  // 📧 ADMIN EMAIL
  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `💳 Paid Order Ready – #${order._id}`,
    html: adminOrderEmail({ order, user }),
  }).catch(console.error);

  return { payment, order };
};
