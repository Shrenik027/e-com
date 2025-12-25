const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const controller = require("../controllers/admin.dashboard.controller");

router.use(auth, role("admin"));

router.get("/", controller.getAdminDashboard);

module.exports = router;
