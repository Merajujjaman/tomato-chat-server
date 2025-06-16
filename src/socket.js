const Message = require("./models/Message.model");


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    const userId = socket.handshake.query.userId;
    if (userId) socket.join(userId);

    // Typing indicator events
    socket.on('typing', ({ to }) => {
      io.to(to).emit('typing', { from: userId });
    });
    socket.on('stop typing', ({ to }) => {
      io.to(to).emit('stop typing', { from: userId });
    });

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