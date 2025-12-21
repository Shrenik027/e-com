const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.isValidObjectId(value)) return helpers.error("any.invalid");
  return value;
};

exports.addToCartSchema = Joi.object({
  productId: Joi.string().required().custom(objectId, "ObjectId validation"),
  quantity: Joi.number().integer().min(1).default(1),
});

exports.updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required(), // 0 means remove
});

exports.applyCouponSchema = Joi.object({
  code: Joi.string().required(),
});

exports.applyShippingSchema = Joi.object({
  shippingMethodId: Joi.string().required(),
});
