const express = require("express");
const mongoose = require("mongoose");

const Message = require("../models/Message");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
==================================================
GET ALL CONVERSATIONS
==================================================
GET /api/messages/conversations
*/

router.get("/conversations", authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user.id.toString();

    const messages = await Message.find({
      $or: [
        { sender: currentUser },
        { receiver: currentUser },
      ],
      deletedFor: {
        $ne: currentUser,
      },
    })
      .sort({ createdAt: -1 })
      .populate("sender", "name username profilePicture")
      .populate("receiver", "name username profilePicture");

    const conversations = new Map();

    for (const message of messages) {
      const senderId = message.sender?._id?.toString();
      const receiverId = message.receiver?._id?.toString();

      if (!senderId || !receiverId) continue;

      const otherUserId =
        senderId === currentUser
          ? receiverId
          : senderId;

      if (!conversations.has(otherUserId)) {
        const otherUser =
          senderId === currentUser
            ? message.receiver
            : message.sender;

        const unreadCount = await Message.countDocuments({
          sender: otherUserId,
          receiver: currentUser,
          read: false,
          deletedFor: {
            $ne: currentUser,
          },
          deletedForEveryone: false,
        });

        conversations.set(otherUserId, {
          user: otherUser,

          lastMessage: message.deletedForEveryone
            ? "Message deleted"
            : message.text,

          lastMessageTime: message.createdAt,

          unreadCount,
        });
      }
    }

    const result = Array.from(conversations.values());

    res.json({
      conversations: result,
    });
  } catch (error) {
    console.error("Conversation error:", error);

    res.status(500).json({
      message: "Failed to load conversations",
    });
  }
});

/*
==================================================
GET CHAT BETWEEN TWO USERS
==================================================
GET /api/messages/:userId
*/

router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const currentUser = req.user.id;
    const otherUser = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(otherUser)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

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

      // Don't show messages deleted only for this user
      deletedFor: {
        $ne: currentUser,
      },
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name username profilePicture")
      .populate("receiver", "name username profilePicture");

    /*
    Mark received messages as read
    */

    await Message.updateMany(
      {
        sender: otherUser,
        receiver: currentUser,
        read: false,
        deletedFor: {
          $ne: currentUser,
        },
      },
      {
        $set: {
          read: true,
        },
      }
    );

    res.json({
      messages,
    });
  } catch (error) {
    console.error("Load messages error:", error);

    res.status(500).json({
      message: "Failed to load messages",
    });
  }
});

/*
==================================================
SEND MESSAGE
==================================================
POST /api/messages
*/

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiver, text } = req.body;

    if (!receiver || !text?.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({
        message: "Invalid receiver ID",
      });
    }

    /*
    Prevent messaging yourself
    */

    if (receiver.toString() === req.user.id.toString()) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }

    /*
    Check receiver
    */

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    /*
    Create message
    */

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      text: text.trim(),
    });

    /*
    Populate message
    */

    const populatedMessage = await Message.findById(message._id)
      .populate(
        "sender",
        "name username profilePicture"
      )
      .populate(
        "receiver",
        "name username profilePicture"
      );

    res.status(201).json({
      message: populatedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
});

/*
==================================================
DELETE FOR ME
==================================================
DELETE /api/messages/message/:messageId/me
*/

router.delete(
  "/message/:messageId/me",
  authMiddleware,
  async (req, res) => {
    try {
      const { messageId } = req.params;
      const currentUser = req.user.id;

      if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({
          message: "Invalid message ID",
        });
      }

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          message: "Message not found",
        });
      }

      /*
      User must be part of this conversation
      */

      const isParticipant =
        message.sender.toString() === currentUser.toString() ||
        message.receiver.toString() === currentUser.toString();

      if (!isParticipant) {
        return res.status(403).json({
          message: "You are not part of this conversation",
        });
      }

      /*
      Already deleted for this user
      */

      if (
        message.deletedFor.some(
          (id) => id.toString() === currentUser.toString()
        )
      ) {
        return res.status(400).json({
          message: "Message already deleted for you",
        });
      }

      /*
      Add current user to deletedFor
      */

      message.deletedFor.push(currentUser);

      await message.save();

      res.json({
        message: "Message deleted for you",
        messageId,
        deleteType: "for-me",
      });
    } catch (error) {
      console.error("Delete for me error:", error);

      res.status(500).json({
        message: "Failed to delete message",
      });
    }
  }
);

/*
==================================================
DELETE FOR EVERYONE
==================================================
DELETE /api/messages/message/:messageId/everyone
*/

router.delete(
  "/message/:messageId/everyone",
  authMiddleware,
  async (req, res) => {
    try {
      const { messageId } = req.params;
      const currentUser = req.user.id;

      if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return res.status(400).json({
          message: "Invalid message ID",
        });
      }

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          message: "Message not found",
        });
      }

      /*
      ONLY THE SENDER CAN DELETE FOR EVERYONE
      */

      if (
        message.sender.toString() !==
        currentUser.toString()
      ) {
        return res.status(403).json({
          message:
            "Only the sender can delete a message for everyone",
        });
      }

      /*
      Mark as deleted for everyone
      */

      message.deletedForEveryone = true;

      await message.save();

      res.json({
        message: "Message deleted for everyone",
        messageId,
        deleteType: "for-everyone",
      });
    } catch (error) {
      console.error("Delete for everyone error:", error);

      res.status(500).json({
        message: "Failed to delete message for everyone",
      });
    }
  }
);

/*
==================================================
DELETE ENTIRE CONVERSATION
==================================================
DELETE /api/messages/conversation/:userId
*/

router.delete(
  "/conversation/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const currentUser = req.user.id;
      const otherUser = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(otherUser)) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }

      /*
      IMPORTANT:

      "Delete conversation" here means
      DELETE FOR ME.

      We don't permanently delete messages because
      the other user should still have their copy.
      */

      const result = await Message.updateMany(
        {
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

          deletedFor: {
            $ne: currentUser,
          },
        },
        {
          $addToSet: {
            deletedFor: currentUser,
          },
        }
      );

      res.json({
        message: "Conversation deleted for you",
        modifiedCount: result.modifiedCount,
        userId: otherUser,
        deleteType: "for-me",
      });
    } catch (error) {
      console.error(
        "Delete conversation error:",
        error
      );

      res.status(500).json({
        message: "Failed to delete conversation",
      });
    }
  }
);

/*
==================================================
MARK MESSAGES AS READ
==================================================
PUT /api/messages/read/:userId
*/

router.put(
  "/read/:userId",
  authMiddleware,
  async (req, res) => {
    try {
      const currentUser = req.user.id;
      const otherUser = req.params.userId;

      if (!mongoose.Types.ObjectId.isValid(otherUser)) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }

      await Message.updateMany(
        {
          sender: otherUser,
          receiver: currentUser,
          read: false,
          deletedFor: {
            $ne: currentUser,
          },
        },
        {
          $set: {
            read: true,
          },
        }
      );

      res.json({
        message: "Messages marked as read",
      });
    } catch (error) {
      console.error("Mark read error:", error);

      res.status(500).json({
        message: "Failed to mark messages as read",
      });
    }
  }
);

module.exports = router;