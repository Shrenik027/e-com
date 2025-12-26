const axios = require("axios");

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await axios.post(
    "https://accounts.zoho.in/oauth/v2/token",
    null,
    {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
      timeout: 10000,
    }
  );

  cachedToken = res.data.access_token;
  tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;

  return cachedToken;
}

async function sendEmail({ to, subject, html }) {
  try {
    const token = await getAccessToken();

    const res = await axios.post(
      `https://mail.zoho.in/api/accounts/${process.env.ZOHO_ACCOUNT_ID}/messages`,
      {
        fromAddress: "support@shrix.store", // MUST EXIST IN ZOHO MAIL
        toAddress: to,
        subject,
        content: html,
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json", // 🔥 REQUIRED
        },
        timeout: 10000,
      }
    );

    console.log("✅ Zoho mail sent:", res.data);
  } catch (err) {
    console.error("❌ Zoho mail error:");
    if (err.response) {
      console.error(err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

module.exports = sendEmail;
