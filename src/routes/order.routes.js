const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

router.use(auth);

// Place order
router.post("/", orderController.placeOrder);

// My orders
router.get("/me", orderController.getMyOrders);

// Single order
router.get("/:orderId", orderController.getOrderById);

router.get("/", auth, role("admin"), orderController.getAllOrders);

router.put(
  "/:orderId/status",
  auth,
  role("admin"),
  orderController.updateOrderStatus
);

// Admin order detail
router.get(
  "/admin/:orderId",
  auth,
  role("admin"),
  orderController.getOrderByIdAdmin
);
module.exports = router;
