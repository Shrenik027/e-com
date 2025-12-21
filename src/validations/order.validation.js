const Joi = require("joi");

exports.createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .required(),

  addressId: Joi.string().required(),

  shippingMethod: Joi.string().required(),

  paymentMethod: Joi.string().valid("cod", "stripe", "paypal").required(),

  coupon: Joi.string().allow(null),
});
