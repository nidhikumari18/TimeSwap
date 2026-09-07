const { Server } = require("socket.io");

let io;

const onlineUsers = new Map();

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    // ==========================================
    // USER ONLINE
    // ==========================================

    socket.on("user-online", (userId) => {
      if (!userId) return;

      const id = userId.toString();

      onlineUsers.set(id, socket.id);
      socket.userId = id;

      console.log("👤 User online:", id);
      console.log(
        "Online users:",
        Array.from(onlineUsers.keys())
      );
    });

    // ==========================================
    // SEND MESSAGE
    // ==========================================

    socket.on("send-message", (message) => {
      if (!message) return;

      const receiverId =
        message.receiver?._id ||
        message.receiver?.id ||
        message.receiver;

      if (!receiverId) {
        console.log("❌ Receiver ID missing");
        return;
      }

      const receiverIdString =
        receiverId.toString();

      console.log(
        "📨 Sending message to:",
        receiverIdString
      );

      const receiverSocket =
        onlineUsers.get(receiverIdString);

      if (receiverSocket) {
        io.to(receiverSocket).emit(
          "receive-message",
          message
        );

        console.log("✅ Message delivered");
      } else {
        console.log("⚠️ Receiver is offline");
      }
    });

    // ==========================================
    // MESSAGE DELETED FOR EVERYONE
    // ==========================================

    socket.on("message-deleted-for-everyone", (data) => {
      if (!data) return;

      const {
        messageId,
        receiverId,
      } = data;

      if (!messageId || !receiverId) {
        console.log(
          "❌ Message deletion data missing"
        );
        return;
      }

      const receiverSocket =
        onlineUsers.get(
          receiverId.toString()
        );

      if (receiverSocket) {
        io.to(receiverSocket).emit(
          "message-deleted-for-everyone",
          {
            messageId,
          }
        );

        console.log(
          "🗑️ Delete-for-everyone event sent to:",
          receiverId
        );
      }
    });

    // ==========================================
    // CONVERSATION DELETED
    // ==========================================

    socket.on("conversation-deleted", (data) => {
      if (!data) return;

      const {
        receiverId,
      } = data;

      if (!receiverId) return;

      const receiverSocket =
        onlineUsers.get(
          receiverId.toString()
        );

      if (receiverSocket) {
        io.to(receiverSocket).emit(
          "conversation-deleted",
          {
            userId: socket.userId,
          }
        );

        console.log(
          "🗑️ Conversation deletion event sent"
        );
      }
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", () => {
      if (socket.userId) {
        const currentSocket =
          onlineUsers.get(socket.userId);

        // Only delete if this socket
        // is still the user's active socket
        if (currentSocket === socket.id) {
          onlineUsers.delete(socket.userId);
        }

        console.log(
          "🔴 User offline:",
          socket.userId
        );
      }

      console.log(
        "Socket disconnected:",
        socket.id
      );
    });
  });

  return io;
}

// ==========================================
// GET SOCKET
// ==========================================

function getIO() {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized"
    );
  }

  return io;
}

module.exports = {
  initializeSocket,
  getIO,
};