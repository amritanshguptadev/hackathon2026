import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderMain from '../assets/components/Home/HeaderMain';
import Footer from '../assets/components/Home/Footer';
import ConversationList from '../assets/components/chat/ConversationList';
import ChatWindow from '../assets/components/chat/ChatWindow';
import EmptyChatState from '../assets/components/chat/EmptyChatState';
import { useSocket } from '../context/SocketContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ToastContainer, toast } from 'react-toastify';
import { resolveImageUrl } from '../config/api';
import { DEMO_LISTINGS } from '../data/images';
import {
  MessageSquare,
  Search,
  PlusCircle,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const INITIAL_DEMO_CONVERSATIONS = [
  {
    _id: 'conv-101',
    buyer: {
      _id: 'user-me',
      id: 'user-me',
      name: 'You (Student Buyer)',
      university: 'IIT Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    seller: {
      _id: 'user-arjun',
      id: 'user-arjun',
      name: 'Arjun Verma',
      university: 'IIT Delhi - North Campus',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      verified: true,
      responseTime: 'Replies in ~10 mins',
    },
    product: {
      _id: 'bk-item-1',
      id: 'bk-item-1',
      title: 'HP ProBook 15.6" Student Laptop (Core i5 / 8GB / 256GB SSD)',
      price: 13999,
      condition: 'Good',
      campusLocation: 'Central Library - Ground Floor Entrance',
      image: '/images/products/1.jpg',
      category: 'Electronics',
    },
    lastMessage: {
      text: 'Perfect! I will bring the original charger along to the Library ground floor at 4 PM.',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      sender: 'user-arjun',
      read: true,
    },
    unreadCount: 0,
    type: 'buying',
  },
  {
    _id: 'conv-102',
    buyer: {
      _id: 'user-priya',
      id: 'user-priya',
      name: 'Priya Sharma',
      university: 'Delhi University (DU)',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
    seller: {
      _id: 'user-me',
      id: 'user-me',
      name: 'You (Student Seller)',
      university: 'IIT Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      verified: true,
    },
    product: {
      _id: 'bk-item-2',
      id: 'bk-item-2',
      title: 'Hero Sprint 21-Speed Campus Mountain Bicycle (26T Wheels)',
      price: 2499,
      condition: 'Good',
      campusLocation: 'Hostel Gate 2 / Guard Cabin',
      image: '/images/products/2.jpg',
      category: 'Cycles',
    },
    lastMessage: {
      text: 'Hey! Is the cycle lock and key included with the bicycle?',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      sender: 'user-priya',
      read: false,
    },
    unreadCount: 1,
    type: 'selling',
  },
  {
    _id: 'conv-103',
    buyer: {
      _id: 'user-me',
      id: 'user-me',
      name: 'You (Student Buyer)',
      university: 'IIT Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    seller: {
      _id: 'user-tanmay',
      id: 'user-tanmay',
      name: 'Tanmay Deshmukh',
      university: 'BITS Pilani',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      verified: true,
      responseTime: 'Replies in ~30 mins',
    },
    product: {
      _id: 'bk-item-4',
      id: 'bk-item-4',
      title: 'Humanities & Social Sciences Core Textbook Stack (5 Books)',
      price: 599,
      condition: 'Good',
      campusLocation: 'Student Activity Center (SAC)',
      image: '/images/products/4.jpg',
      category: 'Books & Notes',
    },
    lastMessage: {
      text: 'Yes, all 5 books have neat highlighted sections and previous exam notes inside.',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      sender: 'user-tanmay',
      read: true,
    },
    unreadCount: 0,
    type: 'buying',
  },
];

const INITIAL_DEMO_MESSAGES = {
  'conv-101': [
    {
      _id: 'msg-1',
      text: 'Hi Arjun! Is the HP ProBook laptop still available for campus meetup?',
      sender: 'user-me',
      createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
      read: true,
    },
    {
      _id: 'msg-2',
      text: 'Hey! Yes it is. Battery backup is around 4.5 hours and works smoothly for coding & lectures.',
      sender: 'user-arjun',
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      read: true,
    },
    {
      _id: 'msg-3',
      type: 'offer',
      offerPrice: 13000,
      originalPrice: 13999,
      status: 'accepted',
      text: '💰 Special student counter-offer: ₹13,000',
      sender: 'user-me',
      createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      read: true,
    },
    {
      _id: 'msg-4',
      type: 'meetup_proposal',
      location: 'Central Library - Ground Floor Entrance',
      timeSlot: 'Today (4:00 PM – 6:00 PM)',
      status: 'confirmed',
      text: '📍 Campus Hand-off Proposed: Central Library Ground Floor',
      sender: 'user-arjun',
      createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      read: true,
    },
    {
      _id: 'msg-5',
      text: 'Perfect! I will bring the original charger along to the Library ground floor at 4 PM.',
      sender: 'user-arjun',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      read: true,
    },
  ],
  'conv-102': [
    {
      _id: 'msg-201',
      text: 'Hi! I saw your mountain cycle listing. Is it available for trial ride near Hostel Gate 2?',
      sender: 'user-priya',
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      read: true,
    },
    {
      _id: 'msg-202',
      text: 'Yes Priya! Both gears and brakes were tuned last week.',
      sender: 'user-me',
      createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
      read: true,
    },
    {
      _id: 'msg-203',
      text: 'Hey! Is the cycle lock and key included with the bicycle?',
      sender: 'user-priya',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      read: false,
    },
  ],
  'conv-103': [
    {
      _id: 'msg-301',
      text: 'Hello Tanmay, are there any missing pages in the textbook stack?',
      sender: 'user-me',
      createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
      read: true,
    },
    {
      _id: 'msg-302',
      text: 'Yes, all 5 books have neat highlighted sections and previous exam notes inside.',
      sender: 'user-tanmay',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      read: true,
    },
  ],
};

export default function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { totalUnreadCount } = useSocket() || {};
  const currentUserId = 'user-me';

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem('buykaro_conversations');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEMO_CONVERSATIONS;
  });

  const [selectedConvId, setSelectedConvId] = useState(
    conversationId || conversations[0]?._id || 'conv-101'
  );

  const [messagesMap, setMessagesMap] = useState(() => {
    try {
      const saved = localStorage.getItem('buykaro_all_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DEMO_MESSAGES;
  });

  const [typingUser, setTypingUser] = useState(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('buykaro_conversations', JSON.stringify(conversations));
      localStorage.setItem('buykaro_all_messages', JSON.stringify(messagesMap));
    } catch (e) {
      console.error(e);
    }
  }, [conversations, messagesMap]);

  useEffect(() => {
    if (conversationId) {
      setSelectedConvId(conversationId);
    }
  }, [conversationId]);

  const activeConversation =
    conversations.find((c) => c._id === selectedConvId) || conversations[0] || null;

  const currentMessages = activeConversation
    ? messagesMap[activeConversation._id] || []
    : [];

  const handleSelectConversation = (conv) => {
    setSelectedConvId(conv._id);
    navigate(`/messages/${conv._id}`);

    // Mark as read in state
    setConversations((prev) =>
      prev.map((c) => (c._id === conv._id ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (text, meta = {}) => {
    if (!activeConversation) return;

    const newMsg = {
      _id: `msg-${Date.now()}`,
      text,
      sender: currentUserId,
      createdAt: new Date().toISOString(),
      read: false,
      ...meta,
    };

    const convId = activeConversation._id;

    // Update messages
    setMessagesMap((prev) => ({
      ...prev,
      [convId]: [...(prev[convId] || []), newMsg],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((c) =>
        c._id === convId
          ? {
              ...c,
              lastMessage: {
                text: meta.type === 'offer' ? `Offered ₹${meta.offerPrice}` : text,
                createdAt: newMsg.createdAt,
                sender: currentUserId,
                read: true,
              },
            }
          : c
      )
    );

    // Simulated reply after 1.8 seconds if sending a regular message
    if (!meta.type) {
      setTimeout(() => {
        setTypingUser(activeConversation.seller?.name || 'Seller');
        setTimeout(() => {
          setTypingUser(null);
          const sellerReplies = [
            'Sounds great! Let us meet at the library desk.',
            'Sure, I will be there on time.',
            'Thanks! Feel free to test the item before hand-off.',
            'Got it! See you soon on campus.',
          ];
          const autoReplyText =
            sellerReplies[Math.floor(Math.random() * sellerReplies.length)];

          const autoReplyMsg = {
            _id: `msg-${Date.now()}`,
            text: autoReplyText,
            sender: activeConversation.seller?._id || 'user-other',
            createdAt: new Date().toISOString(),
            read: true,
          };

          setMessagesMap((prev) => ({
            ...prev,
            [convId]: [...(prev[convId] || []), autoReplyMsg],
          }));

          setConversations((prev) =>
            prev.map((c) =>
              c._id === convId
                ? {
                    ...c,
                    lastMessage: {
                      text: autoReplyText,
                      createdAt: autoReplyMsg.createdAt,
                      sender: autoReplyMsg.sender,
                      read: true,
                    },
                  }
                : c
            )
          );
        }, 1200);
      }, 800);
    }
  };

  const handleCreateNewChat = (product) => {
    const existing = conversations.find(
      (c) => String(c.product?._id || c.product?.id) === String(product._id || product.id)
    );

    if (existing) {
      handleSelectConversation(existing);
      return;
    }

    const newConv = {
      _id: `conv-${Date.now()}`,
      buyer: {
        _id: 'user-me',
        id: 'user-me',
        name: 'You (Student Buyer)',
        university: 'IIT Delhi',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      seller: {
        _id: `user-${Date.now()}`,
        id: `user-${Date.now()}`,
        name: product.seller?.name || 'Verified Student Seller',
        university: product.seller?.college || product.location || 'Campus Member',
        phone: '+91 98765 00000',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        verified: true,
        responseTime: 'Replies in ~15 mins',
      },
      product: {
        _id: product._id || product.id,
        id: product._id || product.id,
        title: product.title,
        price: product.price,
        condition: product.condition || 'Good',
        campusLocation: product.location || 'Campus Library / Gate',
        image: product.image || '/images/products/1.jpg',
        category: product.category || 'General',
      },
      lastMessage: {
        text: 'Started conversation regarding this campus listing.',
        createdAt: new Date().toISOString(),
        sender: 'user-me',
        read: true,
      },
      unreadCount: 0,
      type: 'buying',
    };

    setConversations((prev) => [newConv, ...prev]);
    setSelectedConvId(newConv._id);
    navigate(`/messages/${newConv._id}`);
    toast.success(`💬 Chat started with seller for "${product.title?.slice(0, 20)}..."`);
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--cm-bg)] overflow-hidden">
      <HeaderMain showSearchBar={false} />
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 h-full border-r border-slate-200 bg-white ${
            selectedConvId && window.innerWidth < 768 ? 'hidden md:block' : 'block'
          }`}
        >
          <ConversationList
            conversations={conversations}
            selectedId={selectedConvId}
            onSelectConversation={handleSelectConversation}
            onStartNewChat={handleCreateNewChat}
            currentUserId={currentUserId}
          />
        </div>

        {/* Right Area: Active Chat Window */}
        <div
          className={`flex-1 h-full bg-[var(--cm-bg)] ${
            !selectedConvId && window.innerWidth < 768 ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <ChatWindow
              conversation={activeConversation}
              messages={currentMessages}
              onSendMessage={handleSendMessage}
              onBack={() => {
                setSelectedConvId(null);
                navigate('/messages');
              }}
              currentUserId={currentUserId}
              typingUser={typingUser}
            />
          ) : (
            <EmptyChatState onBrowseMarketplace={() => navigate('/all-products')} />
          )}
        </div>
      </div>
    </div>
  );
}
