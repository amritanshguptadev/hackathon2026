const express = require('express');
const router = express.Router();
const profileMiddleware = require('../middleware/userProfile');
const {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  getConversationMessages,
  sendMessageREST,
  markConversationAsRead,
  getTotalUnreadCount,
} = require('../controller/conversationController');

// All conversation routes require authentication
router.use(profileMiddleware);

router.post('/', getOrCreateConversation);
router.get('/', getUserConversations);
router.get('/unread/total', getTotalUnreadCount);
router.get('/:id', getConversationById);
router.get('/:id/messages', getConversationMessages);
router.post('/:id/messages', sendMessageREST);
router.patch('/:id/read', markConversationAsRead);

module.exports = router;
