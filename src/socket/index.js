const http = require('http');
const socketIo = require('socket.io');

const setupSocket = (app) => {
    const server = http.createServer(app);
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on("private message", (msg) => {
            // Broadcast to both sender and receiver
            io.to(msg.receiver).emit("private message", msg);
            io.to(msg.sender).emit("private message", msg);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return server;
};

module.exports = setupSocket;