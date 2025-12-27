exports.adminOrderEmail = ({ order, user }) => {
  const addr = order.address || {};

  const itemsHtml = order.items
    .map((i) => `<li>${i.name} × ${i.quantity} — ₹${i.total}</li>`)
    .join("");

  return `
    <h2>🛒 New Order Received</h2>

    <h3>Customer Details</h3>
    <p>
      <strong>Name:</strong> ${user.name}<br/>
      <strong>Email:</strong> ${user.email}
    </p>

    <h3>Shipping Address</h3>
    <p>
      ${addr.street || ""}<br/>
      ${addr.city || ""} ${addr.state || ""}<br/>
      ${addr.pincode || ""}
    </p>

    <h3>Order Details</h3>
    <ul>${itemsHtml}</ul>

    <p><strong>Total:</strong> ₹${order.total}</p>
    <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
    <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>

    <hr />
    <p>⚡ Please place this order with the supplier.</p>
  `;
};

exports.orderConfirmedEmail = ({ order, user }) => `
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
                  Need help? 
                  <a href="mailto:support@shrix.store" style="color:#f59e0b;text-decoration:none">
                    support@shrix.store
                  </a>
                </p>
              </td>
            </tr>

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
`;
