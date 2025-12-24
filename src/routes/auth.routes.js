const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  googleLogin,
} = require("../controllers/authcontroller");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/verify-email", verifyEmail);

module.exports = router;
