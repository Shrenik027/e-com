// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ZOHO_EMAIL, // support@shrix.store
    pass: process.env.ZOHO_APP_PASSWORD, // Zoho App Password
  },
});

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Shrix Support" <${process.env.ZOHO_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
