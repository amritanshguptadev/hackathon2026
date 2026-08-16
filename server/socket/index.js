import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserModel from '../models/user.js';
import Conversation from '../models/conversation.js';
import Message from '../models/message.js';

const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 5000; // 5 seconds
const MAX_MESSAGES_PER_WINDOW = 15; // Max 15 messages per 5s

// Safe participant ID extractor
function getParticipantId(participant) {
  if (!participant) return '';
  return (participant._id ? participant._id : participant).toString();
}

function isUserParticipant(conversation, userId) {
  if (!conversation || !userId) return false;
  const targetId = userId.toString();
  return (
    getParticipantId(conversation.buyer) === targetId ||
    getParticipantId(conversation.seller) === targetId
  );
}

function initSocket(server, allowedOrigins = []) {
  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        // Allow connections from allowed origins or when origin is not set (e.g. mobile/postman)
        if (!origin) return callback(null, true);
        if (
          process.env.NODE_ENV !== 'production' ||
          allowedOrigins.includes('*') ||
          allowedOrigins.length === 0 ||
          allowedOrigins.includes(origin) ||
          (origin && origin.includes('.vercel.app'))
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      let token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        return next(new Error('Authentication error: Token not provided'));
      }

      if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decoded._id).select('-password');

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      if (user.isSuspended) {
        return next(new Error('Authentication error: Account is suspended'));
      }

      socket.user = user;
      socket.messageTimestamps = [];
      next();
    } catch (err) {
      console.error('Socket auth failed:', err.message);
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();
    console.log(`⚡ Socket connected: user ${socket.user.name} (${userId})`);

    // Join personal notification room
    socket.join(`user_${userId}`);

    // Join specific conversation room (with strict authorization)
    socket.on('join_conversation', async ({ conversationId }, callback) => {
      try {
        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          if (callback) callback({ error: 'Invalid conversation ID' });
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          if (callback) callback({ error: 'Conversation not found' });
          return;
        }

        if (!isUserParticipant(conversation, userId)) {
          if (callback) callback({ error: 'Unauthorized to join this conversation' });
          return;
        }

        socket.join(`conversation_${conversationId}`);
        if (callback) callback({ success: true });
      } catch (err) {
        console.error('Error joining conversation room:', err);
        if (callback) callback({ error: 'Server error joining conversation' });
      }
    });

    // Leave conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.leave(`conversation_${conversationId}`);
      }
    });

    // Real-time send message with anti-spam rate limiting & validation
    socket.on('send_message', async ({ conversationId, text, type = 'text' }, callback) => {
      try {
        // Rate limiting check
        const now = Date.now();
        socket.messageTimestamps = (socket.messageTimestamps || []).filter(
          (t) => now - t < RATE_LIMIT_WINDOW_MS
        );
        if (socket.messageTimestamps.length >= MAX_MESSAGES_PER_WINDOW) {
          if (callback) callback({ error: 'Rate limit exceeded. Please slow down.' });
          return;
        }
        socket.messageTimestamps.push(now);

        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
          if (callback) callback({ error: 'Invalid conversation ID' });
          return;
        }

        if (typeof text !== 'string' || !text.trim()) {
          if (callback) callback({ error: 'Message text cannot be empty' });
          return;
        }

        if (text.length > MAX_MESSAGE_LENGTH) {
          if (callback) callback({ error: `Message exceeds ${MAX_MESSAGE_LENGTH} characters limit` });
          return;
        }

        if (socket.user.isSuspended) {
          if (callback) callback({ error: 'Suspended users cannot send messages' });
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          if (callback) callback({ error: 'Conversation not found' });
          return;
        }

        if (!isUserParticipant(conversation, userId)) {
          if (callback) callback({ error: 'Unauthorized: not a participant in this conversation' });
          return;
        }

        const buyerId = getParticipantId(conversation.buyer);
        const sellerId = getParticipantId(conversation.seller);
        const isBuyer = buyerId === userId;
        const receiverId = isBuyer ? sellerId : buyerId;

        const sanitizedText = text.trim();

        const message = new Message({
          conversation: conversationId,
          sender: socket.user._id,
          receiver: receiverId,
          text: sanitizedText,
          type: ['text', 'offer', 'system'].includes(type) ? type : 'text',
          read: false,
        });

        await message.save();

        // Update conversation summary
        conversation.lastMessage = sanitizedText;
        conversation.lastMessageAt = new Date();
        if (isBuyer) {
          conversation.sellerUnreadCount = (conversation.sellerUnreadCount || 0) + 1;
        } else {
          conversation.buyerUnreadCount = (conversation.buyerUnreadCount || 0) + 1;
        }
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'name email')
          .populate('receiver', 'name email');

        // Broadcast to conversation room
        io.to(`conversation_${conversationId}`).emit('new_message', {
          conversationId,
          message: populatedMessage,
        });

        // Broadcast global unread update to receiver's personal room
        const receiverUnreadCount = await Message.countDocuments({
          receiver: receiverId,
          read: false,
        });

        io.to(`user_${receiverId}`).emit('unread_update', {
          totalUnread: receiverUnreadCount,
          conversationId,
          lastMessage: sanitizedText,
        });

        if (callback) callback({ success: true, message: populatedMessage });
      } catch (err) {
        console.error('Socket send_message error:', err);
        if (callback) callback({ error: err.message || 'Failed to send message' });
      }
    });

    // Mark messages as read in real-time
    socket.on('mark_as_read', async ({ conversationId }, callback) => {
      try {
        if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) return;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        if (!isUserParticipant(conversation, userId)) return;

        const buyerId = getParticipantId(conversation.buyer);
        const isBuyer = buyerId === userId;

        await Message.updateMany(
          { conversation: conversationId, receiver: userId, read: false },
          { $set: { read: true } }
        );

        if (isBuyer) {
          conversation.buyerUnreadCount = 0;
        } else {
          conversation.sellerUnreadCount = 0;
        }
        await conversation.save();

        // Notify conversation room that messages were read
        io.to(`conversation_${conversationId}`).emit('messages_read', {
          conversationId,
          readBy: userId,
        });

        // Update personal unread badge
        const totalUnread = await Message.countDocuments({
          receiver: userId,
          read: false,
        });
        socket.emit('unread_update', { totalUnread });

        if (callback) callback({ success: true });
      } catch (err) {
        console.error('Socket mark_as_read error:', err);
      }
    });

    // Typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
      if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.to(`conversation_${conversationId}`).emit('user_typing', {
          conversationId,
          userId,
          userName: socket.user.name,
          isTyping: !!isTyping,
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: user ${socket.user.name}`);
    });
  });

  return io;
}

export default initSocket;
