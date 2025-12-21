const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const role = require("../middlewares/role.middleware");

const { updateProfileSchema } = require("../validations/user.validation");

// Profile
router.get("/me", auth, userController.getProfile);
router.put(
  "/me",
  auth,
  validate(updateProfileSchema),
  userController.updateProfile
);

// Password
router.put("/change-password", auth, userController.changePassword);

// Address Management
router.post("/address", auth, userController.addAddress);
router.put("/address/:addressId", auth, userController.updateAddress);
router.delete("/address/:addressId", auth, userController.deleteAddress);

// Delete Account
router.delete("/delete-account", auth, userController.deleteAccount);

// ================================
// ⭐ ADMIN-ONLY TEST ROUTE
// ================================
router.get("/admin/test", auth, role("admin"), (req, res) => {
  res.json({ message: "Admin access granted" });
});

module.exports = router;
