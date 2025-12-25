const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/admin.user.controller");

router.use(auth, role("admin"));

router.get("/", controller.getAllUsers);
router.get("/:userId", controller.getUserById);
router.put("/:userId/status", controller.toggleUserStatus);
router.put("/:userId/role", controller.updateUserRole);
router.get("/:userId/orders", controller.getUserOrders);

module.exports = router;
