const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  // content: { type: String, required: true }, // <-- This is critical!
  content: { type: String, required: function() { return this.type === 'text'; } },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ['text', 'image'], default: 'text' },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date, default: null }
});

messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });
messageSchema.index({ receiver: 1, readAt: 1 });

module.exports = mongoose.model("Message", messageSchema);