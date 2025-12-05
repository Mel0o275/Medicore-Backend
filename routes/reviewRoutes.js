const express = require("express");
const router = express.Router();

const {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");
const checkLoginAuth = require("../middleware/checkLoginAuth");

router.route("/:productId").get(getReviewsByProduct);

router.route("/").post(checkLoginAuth, createReview);

router
  .route("/:id")
  .patch(checkLoginAuth, updateReview)
  .delete(checkLoginAuth, deleteReview);

module.exports = router;
