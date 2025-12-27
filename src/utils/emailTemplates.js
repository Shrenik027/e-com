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
