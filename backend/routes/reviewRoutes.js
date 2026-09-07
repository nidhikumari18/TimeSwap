const express = require("express");

const {
  createReview,
  getUserReviews,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a review
router.post("/", protect, createReview);

// Get reviews for a user
router.get("/user/:userId", protect, getUserReviews);

module.exports = router;