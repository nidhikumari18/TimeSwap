const onlineUsers = new Map();

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /*
    ================================================
    USER ONLINE
    ================================================
    */

    socket.on("user-online", (userId) => {
      if (!userId) return;

      onlineUsers.set(userId.toString(), socket.id);

      socket.userId = userId.toString();

      console.log(
        `User ${userId} is online`
      );
    });

    /*
    ================================================
    SEND MESSAGE
    ================================================
    */

    socket.on("send-message", (message) => {
      if (!message) return;

      const receiverId =
        message.receiver?._id ||
        message.receiver?.id ||
        message.receiver;

      if (!receiverId) return;

      const receiverSocket =
        onlineUsers.get(receiverId.toString());

      if (receiverSocket) {
        io.to(receiverSocket).emit(
          "receive-message",
          message
        );
      }
    });

    /*
    ================================================
    MESSAGE DELETED FOR ME
    ================================================
    */

    socket.on(
      "message-deleted-for-me",
      ({ messageId, userId }) => {
        if (!messageId || !userId) return;

        /*
        Only notify the same user's devices.
        The other person should NOT lose the message.
        */

        const userSocket =
          onlineUsers.get(userId.toString());

        if (userSocket) {
          io.to(userSocket).emit(
            "message-deleted-for-me",
            {
              messageId,
            }
          );
        }
      }
    );

    /*
    ================================================
    MESSAGE DELETED FOR EVERYONE
    ================================================
    */

    socket.on(
      "message-deleted-for-everyone",
      ({
        messageId,
        senderId,
        receiverId,
      }) => {
        if (!messageId) return;

        /*
        Notify sender
        */

        if (senderId) {
          const senderSocket =
            onlineUsers.get(
              senderId.toString()
            );

          if (senderSocket) {
            io.to(senderSocket).emit(
              "message-deleted-for-everyone",
              {
                messageId,
              }
            );
          }
        }

        /*
        Notify receiver
        */

        if (receiverId) {
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
          }
        }
      }
    );

    /*
    ================================================
    DISCONNECT
    ================================================
    */

    socket.on("disconnect", () => {
      if (socket.userId) {
        const currentSocket =
          onlineUsers.get(socket.userId);

        /*
        Only remove if this socket is still
        the registered socket for that user.
        */

        if (currentSocket === socket.id) {
          onlineUsers.delete(socket.userId);
        }

        console.log(
          `User ${socket.userId} disconnected`
        );
      }

      console.log(
        "Socket disconnected:",
        socket.id
      );
    });
  });
}

module.exports = socketHandler;