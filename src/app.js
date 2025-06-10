const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const chatRoutes = require("./routes/chatRoutes"); // If you have group chat
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "https://tomato-chat-client.vercel.app"],
  credentials: true
}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
// app.use('/api/chat', chatRoutes); // If you have group chat

module.exports = app;