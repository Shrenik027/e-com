require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const cartRoutes = require("./routes/cart.routes");
const couponRoutes = require("./routes/coupon.routes");
const shippingRoutes = require("./routes/shippingMethod.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();
// Middleware
app.use(express.json());

const cors = require("cors");

// middleware
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://e-com-frontend-nine-phi.vercel.app/", // 👈 YOUR ACTUAL FRONTEND URL
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // since you're using JWT, NOT cookies
  })
);

// 🔥 IMPORTANT: handle preflight explicitly
app.options("*", cors());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/shipping-methods", shippingRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

// Global Error Handler (must be last)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error starting the Server", error);
  }
};

start();
