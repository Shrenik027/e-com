const Joi = require("joi");

exports.createCouponSchema = Joi.object({
  code: Joi.string().min(3).max(20).required(),
  discountType: Joi.string().valid("percent", "flat").required(),
  discountValue: Joi.number().min(1).required(),
  minCartAmount: Joi.number().min(0).default(0),
  maxDiscount: Joi.number().min(0).allow(null),
  expiresAt: Joi.date().required(),
  usageLimit: Joi.number().min(1).allow(null),
});

exports.applyCouponSchema = Joi.object({
  code: Joi.string().required(),
});
