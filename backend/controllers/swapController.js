const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");

// Send swap request
const sendSwapRequest = async (req, res) => {
  try {
    const {
      receiverId,
      skillTheyTeach,
      skillTheyWant,
      message,
    } = req.body;

    const senderId = req.user._id;

    // Check required fields
    if (
      !receiverId ||
      !skillTheyTeach ||
      !skillTheyWant
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Cannot send request to yourself
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        message: "You cannot send a swap request to yourself",
      });
    }

    // Check receiver exists
    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check existing pending request
    const existingRequest = await SwapRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending request",
      });
    }

    // Create request
    const swapRequest = await SwapRequest.create({
      sender: senderId,
      receiver: receiverId,
      skillTheyTeach,
      skillTheyWant,
      message: message || "",
    });

    const populatedRequest =
      await SwapRequest.findById(swapRequest._id)
        .populate("sender", "name username profilePicture")
        .populate("receiver", "name username profilePicture");

    res.status(201).json({
      message: "Swap request sent successfully 🔄",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Send swap request error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get received requests
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      receiver: req.user._id,
    })
      .populate(
        "sender",
        "name username profilePicture skillsToTeach skillsToLearn"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get received requests error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get sent requests
const getSentRequests = async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      sender: req.user._id,
    })
      .populate(
        "receiver",
        "name username profilePicture skillsToTeach skillsToLearn"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get sent requests error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update request status
const updateSwapRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const request = await SwapRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Swap request not found",
      });
    }

    // Only receiver can accept/reject
    if (
      request.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to update this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "This request has already been processed",
      });
    }

    request.status = status;

    await request.save();

    const updatedRequest =
      await SwapRequest.findById(request._id)
        .populate("sender", "name username profilePicture")
        .populate("receiver", "name username profilePicture");

    res.status(200).json({
      message:
        status === "accepted"
          ? "Swap request accepted 🎉"
          : "Swap request rejected",
      request: updatedRequest,
    });
  } catch (error) {
    console.error(
      "Update swap request error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  sendSwapRequest,
  getReceivedRequests,
  getSentRequests,
  updateSwapRequest,
};