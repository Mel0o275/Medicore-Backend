require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const cartRoutes = require("../routes/cart");
const wishRoutes = require("../routes/wish");
const checkRoutes = require("../routes/checkout");
const productRoutes = require("../routes/productsRoutes");
const categoryRoutes = require("../routes/categoryRoutes");

const app = express();
const port = process.env.PORT || 4000;
const URL = process.env.DB_URL;

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
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
