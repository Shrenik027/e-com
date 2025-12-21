const Joi = require("joi");

exports.createBrandSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().allow("", null),
  logo: Joi.string().uri().allow("", null),
});

exports.updateBrandSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  description: Joi.string().allow("", null),
  logo: Joi.string().uri().allow("", null),
});
