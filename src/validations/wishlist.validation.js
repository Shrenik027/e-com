const Joi = require("joi");

exports.addWishlistSchema = Joi.object({
  product: Joi.string().required(),
});
