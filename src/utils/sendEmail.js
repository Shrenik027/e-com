const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

module.exports = async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"Shrix Support" <${process.env.ZOHO_EMAIL}>`,
    to,
    subject,
    html,
  });
};
