const Message = require("./models/Message.model");


module.exports = (io) => {
  io.on('connection', async (socket) => {
    console.log('A user connected');

    // Send existing messages from DB to the new client
    const messages = await Message.find().sort({ createdAt: 1 }).lean();
    socket.emit('chat history', messages);

    socket.on('chat message', async (msg) => {
      const saved = await Message.create(msg);
      io.emit('chat message', saved);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};