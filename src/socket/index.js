const http = require('http');
const socketIo = require('socket.io');
const Message = require('../models/message');

const setupSocket = (app) => {
    const server = http.createServer(app);
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('sendMessage', async (data) => {
            const message = new Message(data);
            await message.save();
            io.emit('receiveMessage', message);
        });

        socket.on("private message", async (msg) => {
            // REMOVE any code here that saves the message to the database!
            // Just broadcast to the recipient:
            io.to(msg.receiver).emit("private message", msg);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return server;
};

module.exports = setupSocket;