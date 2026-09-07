const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");

// =====================================================
// SEND SWAP REQUEST
// =====================================================

const sendSwapRequest = async (req, res) => {
  try {
    const {
      receiverId,
      skillTheyTeach,
      skillTheyWant,
      skill,
      message,
    } = req.body;

    const senderId = req.user._id;

    // -------------------------------------------------
    // Support both:
    // skillTheyTeach / skillTheyWant
    // AND the current Explore.jsx "skill" field
    // -------------------------------------------------

    const finalSkillTheyTeach =
      skillTheyTeach || skill || "";

    const finalSkillTheyWant =
      skillTheyWant || skill || "";

    // -------------------------------------------------
    // Required fields
    // -------------------------------------------------

    if (
      !receiverId ||
      !finalSkillTheyTeach ||
      !finalSkillTheyWant
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // -------------------------------------------------
    // Cannot send request to yourself
    // -------------------------------------------------

    if (
      senderId.toString() ===
      receiverId.toString()
    ) {
      return res.status(400).json({
        message:
          "You cannot send a swap request to yourself",
      });
    }

    // -------------------------------------------------
    // Check receiver exists
    // -------------------------------------------------

    const receiver =
      await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -------------------------------------------------
    // Check existing pending request
    // -------------------------------------------------

    const existingRequest =
      await SwapRequest.findOne({
        sender: senderId,
        receiver: receiverId,
        status: "pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        message:
          "You already have a pending request",
      });
    }

    // -------------------------------------------------
    // Create request
    // -------------------------------------------------

    const swapRequest =
      await SwapRequest.create({
        sender: senderId,
        receiver: receiverId,

        skillTheyTeach:
          finalSkillTheyTeach,

        skillTheyWant:
          finalSkillTheyWant,

        message: message || "",

        status: "pending",
      });

    // -------------------------------------------------
    // Populate sender + receiver
    // -------------------------------------------------

    const populatedRequest =
      await SwapRequest.findById(
        swapRequest._id
      )
        .populate(
          "sender",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .populate(
          "receiver",
          "name username profilePicture skillsToTeach skillsToLearn"
        );

    // -------------------------------------------------
    // Response
    // -------------------------------------------------

    return res.status(201).json({
      message:
        "Swap request sent successfully 🔄",

      request: populatedRequest,
    });

  } catch (error) {
    console.error(
      "Send swap request error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// GET RECEIVED REQUESTS
// =====================================================

const getReceivedRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await SwapRequest.find({
        receiver: req.user._id,
      })
        .populate(
          "sender",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .populate(
          "receiver",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error(
      "Get received requests error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// GET SENT REQUESTS
// =====================================================

const getSentRequests = async (
  req,
  res
) => {
  try {
    const requests =
      await SwapRequest.find({
        sender: req.user._id,
      })
        .populate(
          "sender",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .populate(
          "receiver",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error(
      "Get sent requests error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// GET ALL REQUESTS FOR CURRENT USER
// =====================================================

const getMyRequests = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const requests =
      await SwapRequest.find({
        $or: [
          {
            sender: userId,
          },
          {
            receiver: userId,
          },
        ],
      })
        .populate(
          "sender",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .populate(
          "receiver",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      count: requests.length,
      requests,
    });

  } catch (error) {
    console.error(
      "Get my requests error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// UPDATE REQUEST STATUS
// =====================================================

const updateSwapRequest = async (
  req,
  res
) => {
  try {
    const { requestId } =
      req.params;

    const { status } =
      req.body;

    // -------------------------------------------------
    // Validate status
    // -------------------------------------------------

    if (
      !["accepted", "rejected"].includes(
        status
      )
    ) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // -------------------------------------------------
    // Find request
    // -------------------------------------------------

    const request =
      await SwapRequest.findById(
        requestId
      );

    if (!request) {
      return res.status(404).json({
        message:
          "Swap request not found",
      });
    }

    // -------------------------------------------------
    // Only receiver can accept/reject
    // -------------------------------------------------

    if (
      request.receiver.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to update this request",
      });
    }

    // -------------------------------------------------
    // Check current status
    // -------------------------------------------------

    if (
      request.status !== "pending"
    ) {
      return res.status(400).json({
        message:
          "This request has already been processed",
      });
    }

    // -------------------------------------------------
    // Update
    // -------------------------------------------------

    request.status = status;

    await request.save();

    // -------------------------------------------------
    // Populate updated request
    // -------------------------------------------------

    const updatedRequest =
      await SwapRequest.findById(
        request._id
      )
        .populate(
          "sender",
          "name username profilePicture skillsToTeach skillsToLearn"
        )
        .populate(
          "receiver",
          "name username profilePicture skillsToTeach skillsToLearn"
        );

    return res.status(200).json({
      message:
        status === "accepted"
          ? "Swap request accepted 🎉"
          : "Swap request rejected",

      request: updatedRequest,
    });

  } catch (error) {
    console.error(
      "Update swap request error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  sendSwapRequest,
  getReceivedRequests,
  getSentRequests,
  getMyRequests,
  updateSwapRequest,
};