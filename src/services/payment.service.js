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
                    order.paymentMethod === "Online"
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

  // 📧 ADMIN EMAIL
  sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `💳 Paid Order Ready – #${order._id}`,
    html: adminOrderEmail({ order, user }),
  }).catch(console.error);

  return { payment, order };
};
