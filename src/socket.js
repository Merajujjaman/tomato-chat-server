const Message = require("./models/Message.model");


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    const userId = socket.handshake.query.userId;
    if (userId) socket.join(userId);

    // Private message send/receive (NO database save here)
    socket.on('private message', (msg) => {
      io.to(msg.receiver).emit('private message', msg);
      io.to(msg.sender).emit('private message', msg);
    });

    // Fetch chat history between two users (keep this)
    socket.on('get history', async ({ userId, otherUserId }) => {
      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId }
        ]
      }).sort({ createdAt: 1 }).lean();
      socket.emit('chat history', messages);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};