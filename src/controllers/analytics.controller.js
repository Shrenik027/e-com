const analyticsService = require("../services/analytics.service");

exports.getMarketBasket = async (req, res, next) => {
  try {
    const rules = await analyticsService.generateMarketBasketAnalysis();
    res.json({ rules });
  } catch (err) {
    next(err);
  }
};
