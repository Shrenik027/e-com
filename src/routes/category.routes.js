const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category.controller");
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validations/category.validation");

// Public
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

// Admin
router.post(
  "/",
  auth,
  role("admin"),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.put(
  "/:id",
  auth,
  role("admin"),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete("/:id", auth, role("admin"), categoryController.deleteCategory);

module.exports = router;
