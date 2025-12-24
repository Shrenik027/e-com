const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

/* ================= REGISTER ================= */
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

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verify your email</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
    "
  >
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 16px">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 560px;
              background-color: #ffffff;
              border-radius: 12px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
              overflow: hidden;
            "
          >
            <tr>
              <td
                style="
                  padding: 28px 32px;
                  background: linear-gradient(
                    135deg,
                    #f59e0b,
                    #f97316
                  );
                  color: #ffffff;
                "
              >
                <h1 style="margin: 0; font-size: 22px; font-weight: 700">
                  Welcome to Shrix 🎉
                </h1>
                <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9">
                  Your account has been created successfully
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding: 32px">
                <p style="font-size: 16px; margin: 0 0 16px">
                  Hi 👋,
                </p>

                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 20px">
                  Thank you for creating an account with <strong>Shrix</strong>.
                  You’re just one step away from getting started.
                </p>

                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 28px">
                  Please verify your email address to activate your account and
                  enjoy a secure shopping experience.
                </p>

                <div style="text-align: center; margin: 32px 0">
                  <a
                    href="${verifyLink}"
                    style="
                      background: linear-gradient(
                        135deg,
                        #f59e0b,
                        #f97316
                      );
                      color: #ffffff;
                      text-decoration: none;
                      padding: 14px 28px;
                      font-size: 15px;
                      font-weight: 600;
                      border-radius: 10px;
                      display: inline-block;
                    "
                  >
                    Verify Email Address
                  </a>
                </div>

                <p
                  style="
                    font-size: 14px;
                    line-height: 1.6;
                    color: #374151;
                    margin: 0 0 12px;
                  "
                >
                  ⏳ This verification link will expire in
                  <strong>24 hours</strong>.
                </p>

                <p
                  style="
                    font-size: 14px;
                    line-height: 1.6;
                    color: #6b7280;
                  "
                >
                  If you did not create this account, you can safely ignore this
                  email.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px 32px;
                  background-color: #f9fafb;
                  font-size: 13px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                <p style="margin: 0 0 6px">
                  Need help? Contact us at
                  <a
                    href="mailto:support@shrix.store"
                    style="color: #f59e0b; text-decoration: none"
                    >support@shrix.store</a
                  >
                </p>
                <p style="margin: 0">
                  © ${new Date().getFullYear()} Shrix. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

    await sendEmail({
      to: email,
      subject: "Welcome to Shrix 🎉 Please verify your email",
      html: emailHtml,
    });

    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
};

/* ================= LOGIN ================= */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Check email verification AFTER fetching user
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
  login,
  verifyEmail,
  googleLogin,
};
