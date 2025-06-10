const express = require('express');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: "https://tomato-chat-client.vercel.app",
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;