import { createContext, useState, useEffect, useContext } from "react";

const NotificationContext = createContext();
const User = { uid: localStorage.getItem("email"), name: localStorage.getItem("displayName") };

export const NotificationProvider = ({ children }) => {
  // Load notifications from localStorage on initial render
  const [notifications, setNotifications] = useState(() => {
    try {

      const savedNotifications = localStorage.getItem('notifications');
      if (!savedNotifications) return [];

      const allNotifications = JSON.parse(savedNotifications);
      const myNotifications = allNotifications.filter(n => n.userId === User.uid);

      return myNotifications;
    } catch (error) {
      console.error('Failed to parse notifications from localStorage', error);
      return [];
    }

  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {


    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification) => {
    setNotifications((prev) => {
      const newNotification = {
        id: Date.now(),
         title: notification.title || "New Notification",
      message: notification.message || "No message provided.",
        time: new Date().toISOString(),
        unread: true,
        ...notification
      };
      return [newNotification, ...prev].slice(0, 100); // Limit to 100 notifications
    });
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, unread: false } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, unread: false }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Optional: Clean up old notifications periodically
  useEffect(() => {
    const cleanupOldNotifications = () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      setNotifications(prev =>
        prev.filter(notification => {
          const notificationDate = new Date(notification.time);
          return notificationDate > oneWeekAgo;
        })
      );
    };

    // Clean up every hour
    const interval = setInterval(cleanupOldNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        clearNotifications,
        markAsRead,
        markAllAsRead,
        setNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);