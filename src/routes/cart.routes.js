const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
  applyShippingSchema,
} = require("../validations/cart.validation");

router.use(auth);

router.get("/", cartController.getCart);
router.post("/", validate(addToCartSchema), cartController.addToCart);

router.put(
  "/items/:itemId",
  validate(updateCartItemSchema),
  cartController.updateCartItem
);

router.delete("/items/:itemId", cartController.removeCartItem);
router.delete("/", cartController.clearCart);

// coupon
router.post(
  "/apply-coupon",
  validate(applyCouponSchema),
  cartController.applyCoupon
);

router.post("/remove-coupon", cartController.removeCoupon);

// shipping
router.post(
  "/apply-shipping",
  validate(applyShippingSchema),
  cartController.applyShippingMethod
);

module.exports = router;
