const express = require("express");
const router = express.Router();

const couponController = require("../controllers/coupon.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createCouponSchema,
  applyCouponSchema,
} = require("../validations/coupon.validation");

// Admin create coupon
router.post(
  "/",
  auth,
  role("admin"),
  validate(createCouponSchema),
  couponController.createCoupon
);

// Apply coupon
router.post(
  "/apply",
  auth,
  validate(applyCouponSchema),
  couponController.applyCoupon
);

// Remove coupon
router.delete("/remove", auth, couponController.removeCoupon);

module.exports = router;
