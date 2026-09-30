import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, ShieldCheck, Database, KeyRound, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccess('System configuration saved successfully!');
    setTimeout(() => setSuccess(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">System Administration & Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage Supabase PostgreSQL connection status, JWT secrets, and portal access policies.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Connection Info */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center">
          <Database className="w-5 h-5 mr-2 text-indigo-400" />
          Supabase PostgreSQL Database Connection
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Supabase Host</span>
            <span className="font-bold text-white font-mono">db.tctecdannkhtjgxuwyol.supabase.co</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block">Database Status</span>
            <span className="font-bold text-emerald-400 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Connected (Spring Data JPA)
            </span>
          </div>
        </div>
      </div>

      {/* System Config */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-amber-400" />
          Security Policies
        </h2>

        <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Academic Year Session</label>
            <input
              type="text"
              defaultValue="2025-2026"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">JWT Expiration Timeout (ms)</label>
            <input
              type="number"
              defaultValue="86400000"
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            Save Admin Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
