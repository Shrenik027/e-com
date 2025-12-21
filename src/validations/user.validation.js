const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(40),
  phone: Joi.string().pattern(/^\+?[\d\s-]{10,}$/),
});

exports.changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

exports.addAddressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  zipCode: Joi.string().required(),
  country: Joi.string().required(),
  isDefault: Joi.boolean(),
});

exports.updateAddressSchema = Joi.object({
  street: Joi.string(),
  city: Joi.string(),
  zipCode: Joi.string(),
  country: Joi.string(),
  isDefault: Joi.boolean(),
});
