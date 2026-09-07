const express = require("express");

const {
  getSkills,
  createSkill,
} = require("../controllers/skillController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all available skills
router.get("/", protect, getSkills);

// Create a new skill
router.post("/", protect, createSkill);

module.exports = router;