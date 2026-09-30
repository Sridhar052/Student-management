import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, Bell, Lock, KeyRound, CheckCircle2 } from 'lucide-react';

const StudentSettings = () => {
  const { user } = useAuth();
  const [passwordMsg, setPasswordMsg] = useState('');

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setPasswordMsg('Password updated successfully!');
    setTimeout(() => setPasswordMsg(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Account Settings & Security</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your portal login password, notification preferences, and session security.
        </p>
      </div>

      {passwordMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{passwordMsg}</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-indigo-400" />
          Active Session Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Register Number</span>
            <span className="font-bold text-white font-mono text-sm">{user?.registerNumber}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Registered Email</span>
            <span className="font-bold text-white text-sm">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center">
          <KeyRound className="w-5 h-5 mr-2 text-indigo-400" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordReset} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentSettings;
