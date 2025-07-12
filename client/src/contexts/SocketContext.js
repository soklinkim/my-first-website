import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
      });

      newSocket.on('users-online', (users) => {
        setOnlineUsers(users);
      });

      newSocket.on('message-received', (message) => {
        setMessages(prev => [...prev, message]);
      });

      newSocket.on('user-joined', (user) => {
        setOnlineUsers(prev => [...prev, user]);
      });

      newSocket.on('user-left', (userId) => {
        setOnlineUsers(prev => prev.filter(u => u._id !== userId));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const sendMessage = (receiverId, content) => {
    if (socket) {
      socket.emit('send-message', {
        receiverId,
        content,
      });
    }
  };

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join-room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit('leave-room', roomId);
    }
  };

  const value = {
    socket,
    onlineUsers,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};