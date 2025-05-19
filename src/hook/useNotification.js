import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { API_URL } from "../api/api_url";

export default function useNotification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}notification/`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000); // fetch every 5 seconds
        return () => clearInterval(interval);
    }, []);

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}notification/delete/${id}/`);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (e) {
      console.error("Error deleting notification:", e);
    }
  };

  // Send notification
  const sendNotification = async (payload) => {
    try {
      const res = await axios.post(`${API_URL}notification/create/`, payload);
      if (Array.isArray(res.data)) {
        setNotifications((prev) => [...res.data, ...prev]);
      } else {
        setNotifications((prev) => [res.data, ...prev]);
      }
    } catch (e) {
      console.error("Error sending notification:", e);
    }
  };

  // Mark notifications as read (accepts array of ids)
  const markAsRead = async (ids) => {
    if (!ids || ids.length === 0) return;
    try {
      await axios.post(`${API_URL}notification/mark-as-read/`, { ids });
      setNotifications((prev) =>
        prev.map((notif) =>
          ids.includes(notif.id) ? { ...notif, read: true } : notif
        )
      );
    } catch (e) {
      console.error("Error marking notifications as read:", e);
    }
  };

  return {
    notifications,
    loading,
    deleteNotification,
    sendNotification,
    markAsRead,
  };
}