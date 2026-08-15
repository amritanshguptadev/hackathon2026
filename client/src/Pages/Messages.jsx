import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderMain from '../assets/components/Home/HeaderMain';
import ConversationList from '../assets/components/chat/ConversationList';
import ChatWindow from '../assets/components/chat/ChatWindow';
import EmptyChatState from '../assets/components/chat/EmptyChatState';
import { useSocket } from '../context/SocketContext';
import { handleError, handleSuccess } from '../utils';
import { API_URL } from '../config/api';

// Helper to decode user ID from JWT payload
function getCurrentUserId() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload._id || payload.id;
  } catch {
    return null;
  }
}

export default function Messages() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { socket, refreshUnreadCount } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const currentUserId = getCurrentUserId();
  const activeConvIdRef = useRef(conversationId);
  activeConvIdRef.current = conversationId;

  // 1. Fetch conversations
  const fetchConversations = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/conversations`, {
        headers: { Authorization: token },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setConversations(data.conversations || []);
      } else {
        handleError(data.message || 'Failed to load conversations');
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      handleError('Network error loading conversations');
    } finally {
      setLoadingConversations(false);
    }
  }, [navigate]);

  // 2. Fetch messages for active conversation
  const fetchMessages = useCallback(
    async (convId) => {
      if (!convId) {
        setActiveConversation(null);
        setMessages([]);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setLoadingMessages(true);

        // Fetch conversation details & messages concurrently
        const [convRes, msgRes] = await Promise.all([
          fetch(`${API_URL}/api/conversations/${convId}`, {
            headers: { Authorization: token },
          }),
          fetch(`${API_URL}/api/conversations/${convId}/messages`, {
            headers: { Authorization: token },
          }),
        ]);

        const convData = await convRes.json();
        const msgData = await msgRes.json();

        if (convRes.ok && convData.success) {
          setActiveConversation(convData.conversation);
        }

        if (msgRes.ok && msgData.success) {
          setMessages(msgData.messages || []);
        }

        // Mark conversation as read
        await fetch(`${API_URL}/api/conversations/${convId}/read`, {
          method: 'PATCH',
          headers: { Authorization: token },
        });

        // Notify socket of read event
        if (socket) {
          socket.emit('mark_as_read', { conversationId: convId });
        }
        if (refreshUnreadCount) refreshUnreadCount();

        // Update local conversation list unread counter
        setConversations((prev) =>
          prev.map((c) => {
            if (c._id === convId) {
              const isBuyer = c.buyer?._id === currentUserId || c.buyer === currentUserId;
              return isBuyer
                ? { ...c, buyerUnreadCount: 0 }
                : { ...c, sellerUnreadCount: 0 };
            }
            return c;
          })
        );
      } catch (err) {
        console.error('Error fetching chat messages:', err);
        handleError('Failed to load chat history');
      } finally {
        setLoadingMessages(false);
      }
    },
    [socket, currentUserId, refreshUnreadCount]
  );

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle route change when conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      if (socket) {
        socket.emit('join_conversation', { conversationId });
      }
    } else {
      setActiveConversation(null);
      setMessages([]);
    }

    return () => {
      if (conversationId && socket) {
        socket.emit('leave_conversation', { conversationId });
      }
    };
  }, [conversationId, fetchMessages, socket]);

  // 3. Socket real-time event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload) => {
      const { conversationId: incomingConvId, message } = payload;

      // Update message list if this is the active conversation
      if (activeConvIdRef.current === incomingConvId) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Auto mark as read if currently open
        socket.emit('mark_as_read', { conversationId: incomingConvId });
      }

      // Update conversation list item last message and move to top
      setConversations((prev) => {
        const existingIndex = prev.findIndex((c) => c._id === incomingConvId);
        if (existingIndex === -1) {
          // If brand new conversation, refetch list
          fetchConversations();
          return prev;
        }

        const updatedList = [...prev];
        const isCurrentActive = activeConvIdRef.current === incomingConvId;
        const conv = { ...updatedList[existingIndex] };
        conv.lastMessage = message.text;
        conv.lastMessageAt = message.createdAt;
        conv.updatedAt = message.createdAt;

        const isBuyer = conv.buyer?._id === currentUserId || conv.buyer === currentUserId;
        if (!isCurrentActive && message.sender?._id !== currentUserId) {
          if (isBuyer) {
            conv.buyerUnreadCount = (conv.buyerUnreadCount || 0) + 1;
          } else {
            conv.sellerUnreadCount = (conv.sellerUnreadCount || 0) + 1;
          }
        }

        updatedList.splice(existingIndex, 1);
        return [conv, ...updatedList];
      });

      if (refreshUnreadCount) refreshUnreadCount();
    };

    const handleMessagesRead = ({ conversationId: readConvId, readBy }) => {
      if (activeConvIdRef.current === readConvId && readBy !== currentUserId) {
        // Mark all outgoing messages as read in active UI
        setMessages((prev) =>
          prev.map((m) => (m.sender?._id === currentUserId ? { ...m, read: true } : m))
        );
      }
    };

    const handleUserTyping = ({ conversationId: typingConvId, userName, isTyping }) => {
      if (activeConvIdRef.current === typingConvId) {
        setTypingUser(isTyping ? userName : null);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
      socket.off('user_typing', handleUserTyping);
    };
  }, [socket, currentUserId, fetchConversations, refreshUnreadCount]);

  // 4. Send message handler (Socket + REST fallback)
  const handleSendMessage = async (text) => {
    if (!conversationId || !text.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    if (socket && socket.connected) {
      socket.emit(
        'send_message',
        { conversationId, text: text.trim() },
        (response) => {
          if (response?.error) {
            handleError(response.error);
          }
        }
      );
    } else {
      // Fallback to REST API
      try {
        const res = await fetch(
          `${API_URL}/api/conversations/${conversationId}/messages`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({ text: text.trim() }),
          }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setMessages((prev) => [...prev, data.message]);
          // Update conversation list preview
          setConversations((prev) =>
            prev.map((c) =>
              c._id === conversationId
                ? { ...c, lastMessage: text.trim(), lastMessageAt: new Date() }
                : c
            )
          );
        } else {
          handleError(data.message || 'Failed to send message');
        }
      } catch (err) {
        console.error('REST send fallback error:', err);
        handleError('Failed to send message. Please check connection.');
      }
    }
  };

  const handleSelectConversation = (id) => {
    navigate(`/messages/${id}`);
  };

  const handleBackToConversations = () => {
    navigate('/messages');
  };

  const handleTyping = (isTyping) => {
    if (socket && conversationId) {
      socket.emit('typing', { conversationId, isTyping });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--cm-bg)]">
      <HeaderMain showSearchBar={false} />

      <main className="flex flex-1 overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-7xl border-x border-[var(--cm-border)] bg-white shadow-xs">
          {/* Left: Conversation List */}
          <div
            className={`h-full w-full md:w-[380px] lg:w-[420px] shrink-0 ${
              conversationId ? 'hidden md:block' : 'block'
            }`}
          >
            <ConversationList
              conversations={conversations}
              selectedId={conversationId}
              onSelectConversation={handleSelectConversation}
              loading={loadingConversations}
              currentUserId={currentUserId}
            />
          </div>

          {/* Right: Active Chat Window or Empty State */}
          <div
            className={`h-full flex-1 ${
              conversationId ? 'block' : 'hidden md:block'
            }`}
          >
            {conversationId ? (
              <ChatWindow
                conversation={activeConversation}
                messages={messages}
                loading={loadingMessages}
                onSendMessage={handleSendMessage}
                onBack={handleBackToConversations}
                currentUserId={currentUserId}
                typingUser={typingUser}
                onTyping={handleTyping}
              />
            ) : (
              <EmptyChatState />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
