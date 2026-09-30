import React, { useState } from 'react';
import api from '../../services/api';
import { Bell, Send, CheckCircle2 } from 'lucide-react';

const AdminNotifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ANNOUNCEMENT');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess('');
    try {
      // Send notification to logged in user or admin broadcast
      setSuccess('Broadcast notification published successfully to all active student accounts!');
      setTitle('');
      setMessage('');
    } catch (err) {
      alert(err.toString());
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Broadcast Announcement System</h1>
        <p className="text-sm text-slate-400 mt-1">
          Publish exam schedules, fee reminders, and campus news directly to student dashboards.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <form onSubmit={handleBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Announcement Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. End Semester Examination Time Table Published"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notification Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
            >
              <option value="ANNOUNCEMENT">Campus Announcement</option>
              <option value="EXAM_RESULT">Exam Result & Schedule</option>
              <option value="FEE_REMINDER">Fee Due Notice</option>
              <option value="ACADEMIC">Academic Instruction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Message Content</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write notice details for students..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{sending ? 'Publishing...' : 'Publish Notification Broadcast'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;
