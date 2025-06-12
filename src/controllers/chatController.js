const Message = require("../models/Message.model");
const PushSubscription = require('../models/PushSubscription.model');
const webpush = require('../utils/push'); // The file you just created


// Send a new message
exports.sendMessage = async (req, res) => {
    const { content, sender, receiverId, senderName, messageText } = req.body;

    try {
        const newMessage = new Message({ content, sender });
        await newMessage.save();

        // Find recipient's push subscription
        const recipientSub = await PushSubscription.findOne({ userId: receiverId });
        if (recipientSub) {
            const payload = JSON.stringify({
                title: "New Message",
                body: `${senderName}: ${messageText}`,
                // You can add more fields here (icon, url, etc)
            });
            await webpush.sendNotification(recipientSub.subscription, payload);
        }
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