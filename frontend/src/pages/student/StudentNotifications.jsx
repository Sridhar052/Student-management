import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { Bell, CheckCheck, Trash2, AlertCircle, Calendar } from 'lucide-react';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    let list = [];
    try {
      const res = await api.get('/notifications');
      if (res && res.success && Array.isArray(res.data)) {
        list = res.data;
      }
    } catch (err) {
      console.warn('Notifications API offline, reading dataStore notifications:', err);
    }

    if (list.length === 0) {
      list = dataStore.getNotifications();
    }

    setNotifications(list);
    setLoading(false);
  };

  const handleMarkAsRead = async (id) => {
    dataStore.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.warn('Backend mark notification read failed:', err);
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await api.put('/notifications/read-all');
    } catch (err) {
      console.warn('Backend mark all read failed:', err);
    }
  };

  const handleDelete = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await api.delete(`/notifications/${id}`);
    } catch (err) {
      console.warn('Backend delete notification failed:', err);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Notifications..." />;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Notifications & Alerts</h1>
          <p className="text-sm text-slate-400 mt-1">
            Stay updated with fee reminders, application status changes, and college announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition-all self-start md:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All ({unreadCount}) as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`glass-card p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !n.isRead ? 'border-indigo-500/40 bg-indigo-950/20' : 'border-slate-800'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-2.5 rounded-xl mt-0.5 ${
                    !n.isRead ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{n.title}</h3>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                    <span>Category: {n.type}</span>
                    <span>•</span>
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg text-xs"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Notifications"
          description="You are all caught up! No active alerts or notices."
          icon={Bell}
        />
      )}
    </div>
  );
};

export default StudentNotifications;
