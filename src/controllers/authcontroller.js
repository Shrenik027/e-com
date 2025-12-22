const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/* ================= REGISTER ================= */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

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

    console.log("📩 Sending verification email to:", email);

    await sendEmail({
      to: email,
      subject: "Verify your email to activate your account",
      html: `
  <div style="background-color:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="padding:24px 32px;border-bottom:1px solid #eaeaea;">
        <h2 style="margin:0;color:#111827;font-size:22px;">
          Welcome to Ecommerce 👋
        </h2>
      </div>

      <!-- Body -->
      <div style="padding:32px;color:#374151;line-height:1.6;font-size:15px;">
        <p style="margin-top:0;">
          Thanks for creating an account with <strong>Ecommerce</strong>.
        </p>

        <p>
          To keep your account secure and get full access, please confirm your email address by clicking the button below.
        </p>

        <!-- CTA Button -->
        <div style="text-align:center;margin:32px 0;">
          <a
            href="${verifyUrl}"
            style="
              display:inline-block;
              background:#2563eb;
              color:#ffffff;
              text-decoration:none;
              padding:14px 28px;
              border-radius:6px;
              font-weight:600;
              font-size:15px;
            "
          >
            Verify Email Address
          </a>
        </div>

        <p>
          Once verified, your account will be fully activated and ready to use.
        </p>

        <p>
          If you didn’t create this account, you can safely ignore this email.
        </p>

        <p style="margin-bottom:0;">
          Best regards,<br />
          <strong>The Ecommerce Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #eaeaea;font-size:12px;color:#6b7280;">
        <p style="margin:0;">
          This verification link will expire in 24 hours for security reasons.
        </p>
      </div>

    </div>
  </div>
`,
    });

    return res.status(201).json({
      message: "Account created. Please check your email to verify.",
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

    // If user does NOT exist → create Google user
    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: randomPassword, // will be hashed
        emailVerified: true,
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
