import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated && user) {
            const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
                withCredentials: true
            });

            newSocket.on('connect', () => {
                console.log('🔌 Connected to real-time server');
                newSocket.emit('join', user._id);
            });

            newSocket.on('notification', (notification) => {
                console.log('📡 New notification received:', notification);
                setNotifications((prev) => [notification, ...prev]);
                setUnreadCount((prev) => prev + 1);

                // Show elegant toast
                toast.info(notification.content, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                });
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        }
    }, [isAuthenticated, user]);

    const clearUnread = useCallback(() => {
        setUnreadCount(0);
    }, []);

    return (
        <SocketContext.Provider value={{ socket, notifications, unreadCount, clearUnread }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
