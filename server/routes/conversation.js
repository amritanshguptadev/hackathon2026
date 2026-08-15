import express from 'express';
import profileMiddleware from '../middleware/userProfile.js';
import {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  getConversationMessages,
  sendMessageREST,
  markConversationAsRead,
  getTotalUnreadCount,
} from '../controller/conversationController.js';

const router = express.Router();

// All conversation routes require authentication
router.use(profileMiddleware);

router.post('/', getOrCreateConversation);
router.get('/', getUserConversations);
router.get('/unread/total', getTotalUnreadCount);
router.get('/:id', getConversationById);
router.get('/:id/messages', getConversationMessages);
router.post('/:id/messages', sendMessageREST);
router.patch('/:id/read', markConversationAsRead);

export default router;
