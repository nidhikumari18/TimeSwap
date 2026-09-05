const { Server } = require("socket.io");

let io;

const onlineUsers = new Map();

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("user-online", (userId) => {
      if (!userId) return;

      onlineUsers.set(userId.toString(), socket.id);

      socket.userId = userId.toString();

      console.log("👤 User online:", userId);
    });

    socket.on("send-message", (message) => {
      const receiverSocket = onlineUsers.get(
        message.receiver
      );

      if (receiverSocket) {
        io.to(receiverSocket).emit(
          "receive-message",
          message
        );
      }
    });

    socket.on("disconnect", () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        console.log(
          "🔴 User offline:",
          socket.userId
        );
      }

      console.log(
        "User disconnected:",
        socket.id
      );
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
}

module.exports = {
  initializeSocket,
  getIO,
};