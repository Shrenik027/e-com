const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");

router.use(auth);

// Place order
router.post("/", orderController.placeOrder);

// My orders
router.get("/me", orderController.getMyOrders);

// Single order
router.get("/:orderId", orderController.getOrderById);

module.exports = router;
