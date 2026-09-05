const express = require("express");

const {
  sendSwapRequest,
  getReceivedRequests,
  getSentRequests,
  updateSwapRequest,
} = require("../controllers/swapController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Send swap request
router.post("/request", protect, sendSwapRequest);

// Received requests
router.get("/received", protect, getReceivedRequests);

// Sent requests
router.get("/sent", protect, getSentRequests);

// Accept / reject request
router.put(
  "/request/:requestId",
  protect,
  updateSwapRequest
);

module.exports = router;