const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/* ================= REGISTER ================= */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      name,
      email,
      password, // ✅ PLAIN PASSWORD
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyUrl = `${process.env.BACKEND_URL}/api/v1/auth/verify-email?token=${verificationToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Welcome to Ecommerce</h2>
        <p>Please verify your email to continue:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
};

/* ================= VERIFY EMAIL ================= */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/account?verified=false`);
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/account?verified=true`);
  } catch (err) {
    next(err);
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        error: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );

    res.status(200).json({
      user: { name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/* ================= GOOGLE LOGIN ================= */
const googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let user = await User.findOne({ email });

    // If user does NOT exist → create Google user
    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        emailVerified: true, // Google already verified
        password: crypto.randomBytes(20).toString("hex"), // dummy password
      });
    }

    // If user exists but email not verified → auto verify
    if (!user.emailVerified) {
      user.emailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationExpires = null;
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
    );

    res.status(200).json({
      user: {
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ error: "Google login failed" });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  googleLogin,
};
