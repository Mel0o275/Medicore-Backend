const Feedback = require("../../model/FeedbackModel");

// Create a new feedback
const createFeedback = async (req, res) => {
  try {
    const { fullName, email, product, review, rating, category } = req.body;
    const feedback = new Feedback({
      fullName,
      email,
      product,
      review,
      rating,
      category,
    });
    const savedFeedback = await feedback.save();
    res.status(201).json({
      message: "Feedback created successfully",
      data: savedFeedback,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get all feedbacks
const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json({ data: feedbacks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedbacks,
};
