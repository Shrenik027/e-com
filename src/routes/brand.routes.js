const express = require("express");
const router = express.Router();

const brandController = require("../controllers/brand.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createBrandSchema,
  updateBrandSchema,
} = require("../validations/brand.validation");

// Public
router.get("/", brandController.getBrands);
router.get("/:id", brandController.getBrand);

// Admin
router.post(
  "/",
  auth,
  role("admin"),
  validate(createBrandSchema),
  brandController.createBrand
);
router.put(
  "/:id",
  auth,
  role("admin"),
  validate(updateBrandSchema),
  brandController.updateBrand
);
router.delete("/:id", auth, role("admin"), brandController.deleteBrand);

module.exports = router;
