const Joi = require("joi");

exports.createReviewSchema = Joi.object({
  product: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(""),
});

exports.updateReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5),
  comment: Joi.string().allow(""),
});
