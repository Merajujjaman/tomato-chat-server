const Message = require("./models/Message.model");

const onlineUsers = new Set(); // Track online users

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected");

    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId);
      onlineUsers.add(userId.toString()); // Ensure userId is a string
      io.emit("online-users", Array.from(onlineUsers));
    }

    // Typing indicator events
    socket.on("typing", ({ to }) => {
      io.to(to).emit("typing", { from: userId });
    });
    socket.on("stop typing", ({ to }) => {
      io.to(to).emit("stop typing", { from: userId });
    });

    // Private message send/receive (NO database save here)
    socket.on("private message", (msg) => {
      io.to(msg.receiver).emit("private message", msg);
      io.to(msg.sender).emit("private message", msg);
      // Emit new-message event for real-time unread badge
      io.to(msg.receiver).emit("new-message", { from: msg.sender });
    });

    // Mark messages as read (for real-time badge update)
    socket.on("mark-messages-read", async ({ fromUserId }) => {
      if (!userId) return;
      // Update messages in DB
      await Message.updateMany(
        { sender: fromUserId, receiver: userId, readAt: null },
        { $set: { readAt: new Date() } }
      );
      // Debug log for event emission
      // console.log('Emitting messages-read to', fromUserId, 'by', userId);
      // Notify sender to update their unread counts
      io.to(fromUserId).emit("messages-read", { by: userId });
    });

    // Fetch chat history between two users (keep this)
    socket.on("get history", async ({ userId, otherUserId }) => {
      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      })
        .sort({ createdAt: 1 })
        .lean();
      socket.emit("chat history", messages);
    });

    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId.toString()); // Ensure userId is a string
        io.emit("online-users", Array.from(onlineUsers));
      }
      console.log("A user disconnected");
    });
  });
};
