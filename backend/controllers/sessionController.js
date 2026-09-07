const Session = require("../models/Session");
const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");

// =====================================================
// CREATE SESSION
// =====================================================

const createSession = async (req, res) => {
  try {
    const {
      swapRequestId,
      skill,
      duration,
      scheduledAt,
    } = req.body;

    const learnerId = req.user._id;

    if (!swapRequestId || !skill || !duration) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    // Find swap request
    const swapRequest = await SwapRequest.findById(
      swapRequestId
    );

    if (!swapRequest) {
      return res.status(404).json({
        message: "Swap request not found",
      });
    }

    // Only accepted requests can create sessions
    if (swapRequest.status !== "accepted") {
      return res.status(400).json({
        message:
          "A session can only be created for an accepted swap",
      });
    }

    // Only sender/learner can create the session
    if (
      swapRequest.sender.toString() !==
      learnerId.toString()
    ) {
      return res.status(403).json({
        message:
          "Only the learner can create this session",
      });
    }

    const learner = await User.findById(learnerId);

    if (!learner) {
      return res.status(404).json({
        message: "Learner not found",
      });
    }

    const credits = Number(duration);

    if (!Number.isInteger(credits) || credits < 1) {
      return res.status(400).json({
        message: "Duration must be at least 1 hour",
      });
    }

    // Check credits
    if (learner.credits < credits) {
      return res.status(400).json({
        message:
          "You don't have enough credits for this session",
      });
    }

    // Prevent duplicate active sessions
    const existingSession = await Session.findOne({
      swapRequest: swapRequestId,
      status: {
        $in: ["scheduled", "active"],
      },
    });

    if (existingSession) {
      return res.status(400).json({
        message:
          "A session already exists for this swap",
      });
    }

    const session = await Session.create({
      swapRequest: swapRequestId,

      teacher: swapRequest.receiver,

      learner: swapRequest.sender,

      skill,

      duration: credits,

      credits,

      scheduledAt:
        scheduledAt || null,

      status: "scheduled",
    });

    const populatedSession =
      await Session.findById(session._id)
        .populate(
          "teacher",
          "name username profilePicture"
        )
        .populate(
          "learner",
          "name username profilePicture"
        );

    return res.status(201).json({
      message:
        "Session created successfully 📚",
      session: populatedSession,
    });
  } catch (error) {
    console.error(
      "Create session error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// GET MY SESSIONS
// =====================================================

const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      $or: [
        {
          teacher: userId,
        },
        {
          learner: userId,
        },
      ],
    })
      .populate(
        "teacher",
        "name username profilePicture"
      )
      .populate(
        "learner",
        "name username profilePicture"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error(
      "Get sessions error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// START SESSION
// =====================================================

const startSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session =
      await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const userId =
      req.user._id.toString();

    if (
      session.teacher.toString() !== userId &&
      session.learner.toString() !== userId
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (session.status !== "scheduled") {
      return res.status(400).json({
        message:
          "This session cannot be started",
      });
    }

    session.status = "active";

    await session.save();

    return res.status(200).json({
      message:
        "Session started ▶️",
      session,
    });
  } catch (error) {
    console.error(
      "Start session error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// COMPLETE SESSION
// =====================================================

const completeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session =
      await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const userId =
      req.user._id.toString();

    if (
      session.teacher.toString() !== userId &&
      session.learner.toString() !== userId
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (
      !["scheduled", "active"].includes(
        session.status
      )
    ) {
      return res.status(400).json({
        message:
          "This session cannot be completed",
      });
    }

    // Prevent double credit transfer
    if (session.creditsTransferred) {
      return res.status(400).json({
        message:
          "Credits have already been transferred",
      });
    }

    const learner =
      await User.findById(session.learner);

    const teacher =
      await User.findById(session.teacher);

    if (!learner || !teacher) {
      return res.status(404).json({
        message:
          "Teacher or learner not found",
      });
    }

    // Make sure learner still has credits
    if (
      learner.credits < session.credits
    ) {
      return res.status(400).json({
        message:
          "Learner does not have enough credits",
      });
    }

    // Transfer credits
    learner.credits -= session.credits;

    learner.totalCreditsSpent +=
      session.credits;

    teacher.credits += session.credits;

    teacher.totalCreditsEarned +=
      session.credits;

    await learner.save();
    await teacher.save();

    session.status = "completed";

    session.creditsTransferred = true;

    await session.save();

    return res.status(200).json({
      message:
        `Session completed 🎉 ${session.credits} credits transferred`,
      session,
      learnerCredits:
        learner.credits,
      teacherCredits:
        teacher.credits,
    });
  } catch (error) {
    console.error(
      "Complete session error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


// =====================================================
// CANCEL SESSION
// =====================================================

const cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session =
      await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    const userId =
      req.user._id.toString();

    if (
      session.teacher.toString() !== userId &&
      session.learner.toString() !== userId
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (
      session.status === "completed"
    ) {
      return res.status(400).json({
        message:
          "Completed sessions cannot be cancelled",
      });
    }

    session.status = "cancelled";

    await session.save();

    return res.status(200).json({
      message:
        "Session cancelled",
      session,
    });
  } catch (error) {
    console.error(
      "Cancel session error:",
      error
    );

    return res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  createSession,
  getMySessions,
  startSession,
  completeSession,
  cancelSession,
};