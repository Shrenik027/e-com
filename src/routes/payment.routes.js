const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const paymentController = require("../controllers/payment.controller");

router.post("/create", auth, paymentController.createPayment);
router.post("/verify", auth, paymentController.verifyPayment);

module.exports = router;
