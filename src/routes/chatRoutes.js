const express = require('express');
const { sendMessage, getMessages, markMessagesAsRead, getUnreadCounts, getLastMessagesPerUser } = require('../controllers/chatController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/messages', sendMessage);
router.get('/messages', getMessages);
router.post('/messages/mark-read', auth, markMessagesAsRead);
router.get('/messages/unread-counts', auth, getUnreadCounts);
router.get('/messages/last-per-user', auth, getLastMessagesPerUser);

module.exports = router;