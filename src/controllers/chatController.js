const Message = require("../models/Message.model");


// Send a new message
exports.sendMessage = async (req, res) => {
    const { content, sender } = req.body;

    try {
        const newMessage = new Message({ content, sender });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

// Retrieve all messages
exports.getMessages = async (req, res) => {
    const { userId, otherUserId } = req.query;
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        })
        .sort({ createdAt: 1 }) // oldest first
        .limit(100); // only last 100 messages
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};