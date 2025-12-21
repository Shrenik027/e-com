const Joi = require("joi");

exports.createCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().allow("", null),
  image: Joi.string().uri().allow("", null),
  parent: Joi.string().hex().length(24).allow(null, ""),
});

exports.updateCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().allow("", null),
  image: Joi.string().uri().allow("", null),
  parent: Joi.string().hex().length(24).allow(null, ""),
});
