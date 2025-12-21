const serverless = require("serverless-http");
const app = require("../app"); // ✅ THIS LINE MUST BE EXACT

module.exports = serverless(app);
