const express = require("express");
const router = express.Router();
const {
  register,
  login,
  googleLogin,
} = require("../controllers/authcontroller");

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

module.exports = router;
