const paymentService = require("../services/payment.service");

exports.createPayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID required" });
    }

    const result = await paymentService.createPayment(userId, orderId);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const result = await paymentService.verifyPayment(req.body);

    res.json({
      message: "Payment verified",
      payment: result.payment,
      order: result.order,
    });
  } catch (err) {
    next(err);
  }
};
