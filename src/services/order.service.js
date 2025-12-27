const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User.model");
const { adminOrderEmail } = require("../utils/emailTemplates");

async function placeOrder(userId, address, paymentMethod) {
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
    paymentMethod,
    paymentStatus: "pending", // ✅ FIXED
    orderStatus: "placed",
  });

  // 🧹 Clear cart
  cart.items = [];
  cart.coupon = null;
  cart.subtotal = 0;
  cart.discount = 0;
  cart.shipping = 0;
  cart.total = 0;
  cart.shippingMethod = null;
  await cart.save();

  const user = await User.findById(userId).select("email name");

  // ✅ SEND EMAIL ONLY FOR COD
  if (paymentMethod === "cod") {
    sendEmail({
      to: user.email,
      subject: `Order confirmed – #${order._id}`,
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:32px 16px">
          <table width="100%" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb">
            
            <!-- Header -->
            <tr>
              <td style="padding:24px 28px;background:#111827;color:#ffffff">
                <h1 style="margin:0;font-size:20px;font-weight:600">
                  Order confirmed
                </h1>
                <p style="margin:6px 0 0;font-size:13px;color:#d1d5db">
                  Thank you for shopping with Shrix
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:28px">
                <p style="font-size:14px;margin:0 0 16px">
                  Hi ${user.name},
                </p>

                <p style="font-size:14px;line-height:1.6;margin:0 0 20px">
                  Your order has been successfully placed and is now being processed.
                </p>

                <!-- Order summary -->
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:14px;margin-bottom:20px">
                  <p style="margin:0;font-size:13px;line-height:1.6">
                    <strong>Order ID:</strong> #${order._id}<br/>
                    <strong>Order Total:</strong> ₹${order.total}<br/>
                    <strong>Payment Method:</strong> ${
                      order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Online Payment"
                    }<br/>
                    <strong>Payment Status:</strong> ${
                      order.paymentMethod === "cod" ? "Pay on delivery" : "Paid"
                    }
                  </p>
                </div>

                <p style="font-size:14px;line-height:1.6;margin:0 0 16px">
                  ${
                    order.paymentMethod === "cod"
                      ? "Please keep the payment amount ready at the time of delivery."
                      : "We’ve received your payment successfully."
                  }
                </p>

                <p style="font-size:14px;line-height:1.6;margin:0">
                  You’ll receive another email once your order is shipped.
                </p>

                <p style="font-size:13px;color:#6b7280;margin:20px 0 0">
                  If you have any questions, contact us at
                  <a href="mailto:support@shrix.store" style="color:#f59e0b;text-decoration:none">
                    support@shrix.store
                  </a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 28px;background:#f9fafb;font-size:12px;color:#6b7280;text-align:center">
                © ${new Date().getFullYear()} Shrix. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    }).catch(console.error);

    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 New COD Order – #${order._id}`,
      html: adminOrderEmail({ order, user }),
    }).catch(console.error);
  }

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
