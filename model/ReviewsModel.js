const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    title: String,
    review: {
      type: String,
      required: [true, "Review text is required"],
    },
  },
  { timestamps: true }
);
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
