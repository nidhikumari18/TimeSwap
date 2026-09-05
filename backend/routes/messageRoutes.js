const express = require("express");

const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


/*
GET CHAT BETWEEN TWO USERS
*/

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user.id;
    const otherUser = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: currentUser,
          receiver: otherUser,
        },
        {
          sender: otherUser,
          receiver: currentUser,
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name username")
      .populate("receiver", "name username");

    res.json({
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load messages",
    });
  }
});


/*
SEND MESSAGE
*/

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiver, text } = req.body;

    if (!receiver || !text?.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      text: text.trim(),
    });

    const populatedMessage =
      await Message.findById(message._id)
        .populate("sender", "name username")
        .populate("receiver", "name username");

    res.status(201).json({
      message: populatedMessage,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
});


module.exports = router;