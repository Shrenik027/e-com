const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const adminOrderController = require("../controllers/admin.order.controller");

router.use(auth, role("admin"));

router.get("/", adminOrderController.getAllOrders);
router.get("/:orderId", adminOrderController.getOrderById);
router.put("/:orderId/status", adminOrderController.updateOrderStatus);

module.exports = router;
