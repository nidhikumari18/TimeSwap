const express = require("express");

const {
  createSession,
  getMySessions,
  startSession,
  completeSession,
  cancelSession,
} = require("../controllers/sessionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create session
router.post(
  "/",
  protect,
  createSession
);


// Get my sessions
router.get(
  "/",
  protect,
  getMySessions
);


// Start session
router.put(
  "/:sessionId/start",
  protect,
  startSession
);


// Complete session
router.put(
  "/:sessionId/complete",
  protect,
  completeSession
);


// Cancel session
router.put(
  "/:sessionId/cancel",
  protect,
  cancelSession
);


module.exports = router;