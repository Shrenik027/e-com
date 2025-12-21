// setup.js
const fs = require("fs");
const path = require("path");

const folders = [
  "src/config",
  "src/models",
  "src/controllers",
  "src/services",
  "src/routes",
  "src/middlewares",
  "src/utils",
  "src/validations",
  "src/docs",
];

const files = {
  "src/app.js": "",
  "src/server.js": "",
  "src/docs/swagger.json": "{}",

  // Config files
  "src/config/db.js": "",
  "src/config/cloudinary.js": "",
  "src/config/logger.js": "",
  "src/config/env.js": "",

  // Model files
  "src/models/User.model.js": "",
  "src/models/Product.model.js": "",
  "src/models/Category.model.js": "",
  "src/models/Brand.model.js": "",
  "src/models/Coupon.model.js": "",
  "src/models/Payment.model.js": "",
  "src/models/Review.model.js": "",
  "src/models/Order.model.js": "",
  "src/models/Cart.model.js": "",
  "src/models/Wishlist.model.js": "",
  "src/models/ShippingMethod.model.js": "",

  // Controller files
  "src/controllers/auth.controller.js": "",
  "src/controllers/user.controller.js": "",
  "src/controllers/product.controller.js": "",
  "src/controllers/category.controller.js": "",
  "src/controllers/brand.controller.js": "",
  "src/controllers/coupon.controller.js": "",
  "src/controllers/payment.controller.js": "",
  "src/controllers/review.controller.js": "",
  "src/controllers/order.controller.js": "",
  "src/controllers/cart.controller.js": "",
  "src/controllers/wishlist.controller.js": "",
  "src/controllers/shippingMethod.controller.js": "",

  // Services
  "src/services/auth.service.js": "",
  "src/services/user.service.js": "",
  "src/services/product.service.js": "",
  "src/services/category.service.js": "",
  "src/services/brand.service.js": "",
  "src/services/coupon.service.js": "",
  "src/services/payment.service.js": "",
  "src/services/review.service.js": "",
  "src/services/order.service.js": "",
  "src/services/cart.service.js": "",
  "src/services/wishlist.service.js": "",
  "src/services/shippingMethod.service.js": "",

  // Routes
  "src/routes/auth.routes.js": "",
  "src/routes/user.routes.js": "",
  "src/routes/product.routes.js": "",
  "src/routes/category.routes.js": "",
  "src/routes/brand.routes.js": "",
  "src/routes/coupon.routes.js": "",
  "src/routes/payment.routes.js": "",
  "src/routes/review.routes.js": "",
  "src/routes/order.routes.js": "",
  "src/routes/cart.routes.js": "",
  "src/routes/wishlist.routes.js": "",
  "src/routes/shippingMethod.routes.js": "",

  // Middlewares
  "src/middlewares/auth.middleware.js": "",
  "src/middlewares/role.middleware.js": "",
  "src/middlewares/validate.middleware.js": "",
  "src/middlewares/error.middleware.js": "",
  "src/middlewares/upload.middleware.js": "",

  // Utils
  "src/utils/apiResponse.js": "",
  "src/utils/apiError.js": "",
  "src/utils/sendEmail.js": "",
  "src/utils/token.js": "",
  "src/utils/pagination.js": "",
  "src/utils/fileHelper.js": "",

  // Validations
  "src/validations/user.validation.js": "",
  "src/validations/auth.validation.js": "",
  "src/validations/product.validation.js": "",
  "src/validations/category.validation.js": "",
  "src/validations/brand.validation.js": "",
  "src/validations/coupon.validation.js": "",
  "src/validations/review.validation.js": "",
  "src/validations/order.validation.js": "",
  "src/validations/cart.validation.js": "",
  "src/validations/wishlist.validation.js": "",
  "src/validations/shippingMethod.validation.js": "",
};

// Create folders
folders.forEach((folder) => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log("Created folder:", folderPath);
  }
});

// Create files
Object.keys(files).forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, files[file]);
    console.log("Created file:", filePath);
  }
});

console.log("\n✨ Folder structure created successfully!");
