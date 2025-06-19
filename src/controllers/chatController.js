const Message = require("../models/Message.model");
const PushSubscription = require('../models/PushSubscription.model');
const webpush = require('../utils/push');
const User = require('../models/User.model');

// Send a new message
exports.sendMessage = async (req, res) => {
    const { content, sender, receiver } = req.body;
    const senderUser = await User.findById(sender);

    try {
        const newMessage = new Message({ content, sender, receiver });
        await newMessage.save();

        // Find recipient's push subscription
        const recipientSub = await PushSubscription.findOne({ userId: receiver });
        if (recipientSub) {
            const payload = JSON.stringify({
                title: "New Message",
                body: `${senderUser?.username} sent: ${content}`,
                // Optionally add icon, url, etc.
            });
            // console.log("Sending push notification to:", recipientSub.userId);
            try {
                await webpush.sendNotification(recipientSub.subscription, payload);
                // console.log("Push notification sent!");
            } catch (err) {
                // console.error("Push notification error:", err);
            }
        } else {
            console.log("No subscription found for user:", receiver);
        }
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

// Retrieve all messages between two users
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