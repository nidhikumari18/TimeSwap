const express = require("express");

const router = express.Router();

const {
  sendSwapRequest,
  getReceivedRequests,
  getSentRequests,
  getMyRequests,
  updateSwapRequest,
} = require("../controllers/swapController");

const protect = require("../middleware/authMiddleware");


// Send request
router.post(
  "/request",
  protect,
  sendSwapRequest
);


// Get all my requests
router.get(
  "/request/status",
  protect,
  getMyRequests
);


// Get received requests
router.get(
  "/request/received",
  protect,
  getReceivedRequests
);


// Get sent requests
router.get(
  "/request/sent",
  protect,
  getSentRequests
);


// Accept / reject request
router.put(
  "/request/:requestId",
  protect,
  updateSwapRequest
);


module.exports = router;