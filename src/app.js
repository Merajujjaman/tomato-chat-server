const express = require('express');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/chat', chatRoutes);

module.exports = app;