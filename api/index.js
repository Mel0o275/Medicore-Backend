require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

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

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;
