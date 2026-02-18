const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const analyticsController = require("../controllers/analytics.controller");

router.get("/market-basket", auth, analyticsController.getMarketBasket);

module.exports = router;
