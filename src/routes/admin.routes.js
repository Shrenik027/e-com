const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const adminController = require("../controllers/admin.controller");

router.get(
  "/dashboard",
  auth,
  role("admin"),
  adminController.getDashboardStats
);

module.exports = router;
