const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    product: { type: String, trim: true },
    review: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    category: {
      type: String,
      enum: ["website", "product", "delivery", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
