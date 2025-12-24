const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false,
  pool: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

module.exports = async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"Shrix Support" <${process.env.ZOHO_EMAIL}>`,
    to,
    subject,
    html,
  });
};
