const Review = require("../model/ReviewsModel");
const Product = require("../model/ProductsModel");

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Review.find({ productId })
      .populate("userId", "firstName secondName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: reviews.length,
      data: { reviews },
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err,
    });
  }
};

const createReview = async (req, res) => {
  try {
    const userId = req.user?._id;

    const { productId, rating, title, review } = req.body;
    if (!rating || !review) {
      return res.status(400).json({
        message: "rating and review are required",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    const newReview = await Review.create({
      productId,
      userId,
      rating,
      title,
      review,
    });

    res.status(201).json({ message: "Review created", review: newReview });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user?._id;

    const { rating, title, review } = req.body;

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (existingReview.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this review",
      });
    }
    if (rating !== undefined) existingReview.rating = rating;
    if (title !== undefined) existingReview.title = title;
    if (review !== undefined) existingReview.review = review;

    await existingReview.save();

    res.status(200).json({ message: "Review updated", review: existingReview });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this review" });
    }
    await Review.findByIdAndDelete(reviewId);
    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};
module.exports = {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
};
