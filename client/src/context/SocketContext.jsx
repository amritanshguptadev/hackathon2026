import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../config/api';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const socketRef = useRef(null);

  const fetchUnreadCount = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTotalUnreadCount(0);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/conversations/unread/total`, {
        headers: {
          Authorization: token,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setTotalUnreadCount(data.totalUnread || 0);
      }
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('⚡ Socket connected to server');
      setIsConnected(true);
      fetchUnreadCount();
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('unread_update', (data) => {
      if (typeof data.totalUnread === 'number') {
        setTotalUnreadCount(data.totalUnread);
      } else {
        fetchUnreadCount();
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('Socket connection warning:', err.message);
      setIsConnected(false);
    });

    // Initial unread fetch
    fetchUnreadCount();

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [fetchUnreadCount]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        totalUnreadCount,
        refreshUnreadCount: fetchUnreadCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
