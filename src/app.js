const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const pushRoutes = require('./routes/pushRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://tomato-chat-client.vercel.app"],
  credentials: true
}));
app.use(bodyParser.json());

app.options('*', cors({
  origin: ["http://localhost:3000", "https://tomato-chat-client.vercel.app"],
  credentials: true
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api', chatRoutes);      // <-- Enable chat routes here!
app.use('/api', pushRoutes);
app.use('/api', uploadRoutes);

module.exports = app;