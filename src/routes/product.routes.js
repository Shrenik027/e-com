const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

// Create product + upload images
router.post(
  "/",
  auth,
  role("admin"),
  upload.array("images", 5), // max 5 images
  productController.createProduct
);

router.get("/", productController.getProducts);
router.get("/:productId", productController.getSingleProduct);

router.put(
  "/:productId",
  auth,
  role("admin"),
  upload.array("images", 5),
  productController.updateProduct
);

router.delete(
  "/:productId",
  auth,
  role("admin"),
  productController.deleteProduct
);

module.exports = router;
