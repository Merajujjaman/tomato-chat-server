require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require("socket.io");
const app = require('./app');
const dbConfig = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
dbConfig();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS options
const io = new Server(server, {
    cors: {
        origin: "https://tomato-chat-client.vercel.app", // your deployed frontend
        methods: ["GET", "POST"],
        credentials: true
    }
});
require('./socket')(io);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});