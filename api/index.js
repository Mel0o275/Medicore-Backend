require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 4000;
const URL = process.env.DB_URL;

const allowedOrigins = [
  "http://localhost:5173",
  "https://medicore-backend.vercel.app/api/v1",
  "https://medicore-theta.vercel.app/"
];

const cors = require("cors");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const cartRoutes = require("../routes/cart");
const wishRoutes = require("../routes/wish");
const checkRoutes = require("../routes/checkout");
const productRoutes = require("../routes/productsRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const reviewRoutes = require("../routes/reviewRoutes");
const orderRoutes = require("../routes/orderroute");
const feedbackRoutes = require("../routes/feedbackRoutes");

// Malak
const userRoute = require("../routes/user.route");
const notiRoute = require("../routes/noti.route");

// Malak
const HttpStatus = require("../utils/httpStatusText");

const authRoutes = require("../routes/authRoutes");

app.use(express.json());

mongoose
  .connect(URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(`Database connection error: ${err.message}`));

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wish", wishRoutes);
app.use("/api/v1/checkout", checkRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

// Malak
app.use("/api/v1/user", userRoute);
app.use("/api/v1/notifications", notiRoute);

//  Global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || HttpStatus.ERROR,
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
