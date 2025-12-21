ecommerce-api/
│
├── src/
│ ├── config/
│ │ ├── db.js
│ │ ├── cloudinary.js
│ │ ├── logger.js
│ │ └── env.js
│ │
│ ├── models/
│ │ ├── User.model.js
│ │ ├── Product.model.js
│ │ ├── Category.model.js
│ │ ├── Brand.model.js
│ │ ├── Coupon.model.js
│ │ ├── Payment.model.js
│ │ ├── Review.model.js
│ │ ├── Order.model.js
│ │ ├── Cart.model.js
│ │ ├── Wishlist.model.js
│ │ └── ShippingMethod.model.js
│ │
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ ├── user.controller.js
│ │ ├── product.controller.js
│ │ ├── category.controller.js
│ │ ├── brand.controller.js
│ │ ├── coupon.controller.js
│ │ ├── payment.controller.js
│ │ ├── review.controller.js
│ │ ├── order.controller.js
│ │ ├── cart.controller.js
│ │ ├── wishlist.controller.js
│ │ └── shippingMethod.controller.js
│ │
│ ├── services/
│ │ ├── auth.service.js
│ │ ├── user.service.js
│ │ ├── product.service.js
│ │ ├── category.service.js
│ │ ├── brand.service.js
│ │ ├── coupon.service.js
│ │ ├── payment.service.js
│ │ ├── review.service.js
│ │ ├── order.service.js
│ │ ├── cart.service.js
│ │ ├── wishlist.service.js
│ │ └── shippingMethod.service.js
│ │
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── user.routes.js
│ │ ├── product.routes.js
│ │ ├── category.routes.js
│ │ ├── brand.routes.js
│ │ ├── coupon.routes.js
│ │ ├── payment.routes.js
│ │ ├── review.routes.js
│ │ ├── order.routes.js
│ │ ├── cart.routes.js
│ │ ├── wishlist.routes.js
│ │ └── shippingMethod.routes.js
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.js
│ │ ├── role.middleware.js
│ │ ├── validate.middleware.js
│ │ ├── error.middleware.js
│ │ └── upload.middleware.js // Multer or cloudinary uploader
│ │
│ ├── utils/
│ │ ├── apiResponse.js
│ │ ├── apiError.js
│ │ ├── sendEmail.js
│ │ ├── token.js
│ │ ├── pagination.js
│ │ └── fileHelper.js
│ │
│ ├── validations/
│ │ ├── user.validation.js
│ │ ├── auth.validation.js
│ │ ├── product.validation.js
│ │ ├── category.validation.js
│ │ ├── brand.validation.js
│ │ ├── coupon.validation.js
│ │ ├── review.validation.js
│ │ ├── order.validation.js
│ │ ├── cart.validation.js
│ │ ├── wishlist.validation.js
│ │ └── shippingMethod.validation.js
│ │
│ ├── docs/
│ │ └── swagger.json // API Documentation
│ │
│ ├── app.js
│ └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
