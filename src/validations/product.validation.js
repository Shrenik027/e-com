const Joi = require("joi");

exports.createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).required(),
  category: Joi.string().hex().length(24).allow(null, ""),
  brand: Joi.string().hex().length(24).allow(null, ""),
  discount: Joi.number().min(0).max(100),
  images: Joi.array().items(Joi.string()),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
  category: Joi.string(),
  brand: Joi.string(),
  discount: Joi.number().min(0).max(100),
  images: Joi.array().items(Joi.string()),
});
