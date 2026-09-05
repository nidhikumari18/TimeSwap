const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  exploreUsers,
  findSkillMatches,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user's profile
router.get("/me", protect, getMyProfile);

// Update logged-in user's profile
router.put("/me", protect, updateMyProfile);

// Explore other users
router.get("/explore", protect, exploreUsers);

// Find skill matches
router.get("/matches", protect, findSkillMatches);

module.exports = router;