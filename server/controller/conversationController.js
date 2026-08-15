const mongoose = require('mongoose');
const Conversation = require('../models/conversation');
const Message = require('../models/message');
const UserModel = require('../models/user');
const FeaturedProduct = require('../models/featuredProduct');
const Deal = require('../models/deals');

const MAX_MESSAGE_LENGTH = 2000;

// Safe participant ID extractor
function getParticipantId(participant) {
  if (!participant) return '';
  return (participant._id ? participant._id : participant).toString();
}

// Safe participant check
function isUserParticipant(conversation, userId) {
  if (!conversation || !userId) return false;
  const targetId = userId.toString();
  return (
    getParticipantId(conversation.buyer) === targetId ||
    getParticipantId(conversation.seller) === targetId
  );
}

// Helper to find product from either collection
async function findProduct(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return { product: null, modelName: null };
  }
  let product = await FeaturedProduct.findById(productId);
  let modelName = 'FeaturedProduct';
  if (!product) {
    product = await Deal.findById(productId);
    modelName = 'Deal';
  }
  return { product, modelName };
}

// 1. Get or Create conversation for a product
const getOrCreateConversation = async (req, res) => {
  try {
    const buyerId = req.user._id;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Valid Product ID is required' });
    }

    if (req.user.isSuspended) {
      return res.status(403).json({ success: false, message: 'Suspended users cannot start conversations' });
    }

    const { product, modelName } = await findProduct(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Determine seller user securely from database
    let sellerUser = null;
    if (product.seller && product.seller.email) {
      sellerUser = await UserModel.findOne({ email: String(product.seller.email).trim().toLowerCase() }).select('-password');
    }
    if (!sellerUser && product.seller && product.seller._id && mongoose.Types.ObjectId.isValid(product.seller._id)) {
      sellerUser = await UserModel.findById(product.seller._id).select('-password');
    }
    if (!sellerUser && product.seller && product.seller.name) {
      sellerUser = await UserModel.findOne({ name: product.seller.name }).select('-password');
    }

    // Fallback registration if legacy product lacks registered user entry
    if (!sellerUser && product.seller) {
      const fallbackEmail = product.seller.email || `seller_${product._id}@studx.campus`;
      sellerUser = await UserModel.findOne({ email: fallbackEmail.toLowerCase() }).select('-password');
      if (!sellerUser) {
        sellerUser = await UserModel.create({
          name: product.seller.name || 'Campus Seller',
          email: fallbackEmail.toLowerCase(),
          password: 'SellerPlaceholderPassword123!',
          studentId: `STU-${Date.now()}`,
          university: product.seller.college || 'University Campus',
          idCardPath: '/uploads/id-cards/placeholder.png',
          studentDeclared: true,
          verificationStatus: 'verified',
        });
      }
    }

    if (!sellerUser) {
      return res.status(400).json({ success: false, message: 'Unable to identify seller for this product' });
    }

    const sellerId = sellerUser._id;

    // Security Rule: Buyer and seller cannot be the same user
    if (buyerId.toString() === sellerId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot message yourself about your own product',
      });
    }

    // Check for existing conversation (buyer + seller + product)
    let conversation = await Conversation.findOne({
      buyer: buyerId,
      seller: sellerId,
      product: product._id,
    })
      .populate('buyer', 'name email university verificationStatus')
      .populate('seller', 'name email university verificationStatus')
      .populate('product');

    if (!conversation) {
      try {
        const newConv = new Conversation({
          buyer: buyerId,
          seller: sellerId,
          product: product._id,
          productModel: modelName,
          buyerUnreadCount: 0,
          sellerUnreadCount: 0,
          lastMessage: '',
          lastMessageAt: null,
        });

        await newConv.save();
        conversation = await Conversation.findById(newConv._id)
          .populate('buyer', 'name email university verificationStatus')
          .populate('seller', 'name email university verificationStatus')
          .populate('product');
      } catch (saveErr) {
        // Concurrency guard: If duplicate key error occurs due to concurrent requests, fetch existing
        if (saveErr.code === 11000) {
          conversation = await Conversation.findOne({
            buyer: buyerId,
            seller: sellerId,
            product: product._id,
          })
            .populate('buyer', 'name email university verificationStatus')
            .populate('seller', 'name email university verificationStatus')
            .populate('product');
        } else {
          throw saveErr;
        }
      }
    }

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error('Error in getOrCreateConversation:', error);
    return res.status(500).json({ success: false, message: 'Server error creating conversation' });
  }
};

// 2. Get all conversations for current user
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      $or: [{ buyer: userId }, { seller: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate('buyer', 'name email university verificationStatus')
      .populate('seller', 'name email university verificationStatus')
      .populate('product');

    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    return res.status(500).json({ success: false, message: 'Server error loading conversations' });
  }
};

// 3. Get single conversation by ID
const getConversationById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(id)
      .populate('buyer', 'name email university verificationStatus')
      .populate('seller', 'name email university verificationStatus')
      .populate('product');

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Access control: strictly verify current user is either buyer or seller
    if (!isUserParticipant(conversation, userId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to conversation' });
    }

    return res.status(200).json({ success: true, conversation });
  } catch (error) {
    console.error('Error in getConversationById:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching conversation' });
  }
};

// 4. Get message history for conversation
const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!isUserParticipant(conversation, userId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to messages' });
    }

    const messages = await Message.find({ conversation: id })
      .sort({ createdAt: 1 })
      .limit(100)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error('Error in getConversationMessages:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching messages' });
  }
};

// 5. Send message via REST fallback
const sendMessageREST = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: conversationId } = req.params;
    const { text, type = 'text' } = req.body;

    if (req.user.isSuspended) {
      return res.status(403).json({ success: false, message: 'Suspended users cannot send messages' });
    }

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: 'Invalid conversation ID' });
    }

    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text cannot be empty' });
    }

    if (text.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!isUserParticipant(conversation, senderId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: not a participant' });
    }

    const buyerId = getParticipantId(conversation.buyer);
    const sellerId = getParticipantId(conversation.seller);
    const isBuyer = buyerId === senderId.toString();
    const receiverId = isBuyer ? sellerId : buyerId;

    const sanitizedText = text.trim();

    const message = new Message({
      conversation: conversationId,
      sender: senderId,
      receiver: receiverId,
      text: sanitizedText,
      type: ['text', 'offer', 'system'].includes(type) ? type : 'text',
      read: false,
    });

    await message.save();

    // Update conversation last message & unread counter
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

    return res.status(201).json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error('Error in sendMessageREST:', error);
    return res.status(500).json({ success: false, message: 'Server error sending message' });
  }
};

// 6. Mark conversation messages as read
const markConversationAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    if (!isUserParticipant(conversation, userId)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const buyerId = getParticipantId(conversation.buyer);
    const isBuyer = buyerId === userId.toString();

    // Mark all messages addressed to this user as read
    await Message.updateMany(
      { conversation: conversationId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    // Reset unread counter for current user in conversation
    if (isBuyer) {
      conversation.buyerUnreadCount = 0;
    } else {
      conversation.sellerUnreadCount = 0;
    }
    await conversation.save();

    return res.status(200).json({ success: true, message: 'Marked as read' });
  } catch (error) {
    console.error('Error in markConversationAsRead:', error);
    return res.status(500).json({ success: false, message: 'Server error marking messages as read' });
  }
};

// 7. Get total unread count across all conversations
const getTotalUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalUnread = await Message.countDocuments({
      receiver: userId,
      read: false,
    });
    return res.status(200).json({ success: true, totalUnread });
  } catch (error) {
    console.error('Error in getTotalUnreadCount:', error);
    return res.status(500).json({ success: false, message: 'Server error getting unread count' });
  }
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  getConversationById,
  getConversationMessages,
  sendMessageREST,
  markConversationAsRead,
  getTotalUnreadCount,
};
