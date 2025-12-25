const express = require("express");
const router = express.Router();

const controller = require("../controllers/shippingMethod.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");

const {
  createShippingMethodSchema,
  updateShippingMethodSchema,
} = require("../validations/shippingMethod.validation");

// Public — list available shipping methods
router.get("/", controller.getShippingMethods);
router.get("/:id", controller.getShippingMethod);
router.get(
  "/admin/all",
  auth,
  role("admin"),
  controller.getAllShippingMethodsAdmin
);

// Admin only routes
router.post(
  "/",
  auth,
  role("admin"),
  validate(createShippingMethodSchema),
  controller.createShippingMethod
);

router.put(
  "/:id",
  auth,
  role("admin"),
  validate(updateShippingMethodSchema),
  controller.updateShippingMethod
);

router.delete("/:id", auth, role("admin"), controller.deleteShippingMethod);

module.exports = router;
