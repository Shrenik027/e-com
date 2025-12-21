const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  googleLogin,
} = require("../controllers/authcontroller");

router.get("/verify-email", verifyEmail);
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;
