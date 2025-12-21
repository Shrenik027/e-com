const Joi = require("joi");

exports.createShippingMethodSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().min(0).required(),
  estimatedDays: Joi.number().min(1).required(),
  isActive: Joi.boolean().optional(),
});

exports.updateShippingMethodSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  price: Joi.number().min(0),
  estimatedDays: Joi.number().min(1),
  isActive: Joi.boolean(),
});
