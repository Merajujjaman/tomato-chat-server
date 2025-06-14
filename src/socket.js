const Message = require("./models/Message.model");


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    const userId = socket.handshake.query.userId;
    if (userId) socket.join(userId);

    // Private message send/receive
    socket.on('private message', async (msg) => {
      // msg: { text, sender, receiver }
      const saved = await Message.create(msg);
      io.to(msg.receiver).emit('private message', saved);
      io.to(msg.sender).emit('private message', saved);
    });

    // Fetch chat history between two users
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