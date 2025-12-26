const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/* ================= REGISTER ================= */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔐 Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    await User.create({
      name,
      email,
      password,
      emailVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyLink = `${process.env.BACKEND_URL}/api/v1/auth/verify-email?token=${verificationToken}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family:Arial;background:#f9fafb">
  <h2>Welcome to Shrix 🎉</h2>
  <p>Please verify your email to activate your account.</p>
  <a href="${verifyLink}" style="padding:12px 20px;background:#f97316;color:#fff;text-decoration:none;border-radius:6px">
    Verify Email
  </a>
  <p>This link expires in 24 hours.</p>
</body>
</html>
`;

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });

    // 📧 Send email (async, non-blocking)
    sendEmail({
      to: email,
      subject: "Welcome to Shrix 🎉 Please verify your email",
      html: emailHtml,
    }).catch((err) => {
      console.error("❌ Email send failed:", err.message);
    });
  } catch (error) {
    next(error);
  }
};

/* ================= VERIFY EMAIL ================= */
const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/verify-email?status=invalid`
    );
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/verify-email?status=invalid`
    );
  }

  if (user.emailVerified) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/verify-email?status=already`
    );
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return res.redirect(
    `${process.env.FRONTEND_URL}/verify-email?status=success`
  );
};

/* ================= LOGIN ================= */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        error: "Your account has been blocked. Contact support.",
      });
    }

    if (!user.emailVerified) {
      return res.status(401).json({
        error: "Please verify your email before logging in",
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials" });
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
    next(error);
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

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: randomPassword,
        emailVerified: true,
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
    console.error("Google login error:", error);
    res.status(500).json({ error: "Google login failed" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  googleLogin,
};
