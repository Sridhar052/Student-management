import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, User as UserIcon, Menu, GraduationCap, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      if (res.success) {
        setUnreadCount(res.data || 0);
      }
    } catch (e) {
      // silent catch
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/30">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              StudentHub
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-indigo-400">
              College Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex items-center space-x-4">
        {/* Role Badge */}
        <div className="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-indigo-300">
          {isAdmin ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              ADMINISTRATOR
            </>
          ) : (
            <>
              <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              STUDENT ({user?.registerNumber})
            </>
          )}
        </div>

        {/* Notifications Icon */}
        <Link
          to={isAdmin ? '/admin/notifications' : '/student/notifications'}
          className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Info & Avatar */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
          <Link
            to={isAdmin ? '/admin/settings' : '/student/profile'}
            className="flex items-center space-x-2 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md group-hover:ring-2 ring-indigo-500/50 transition-all">
              <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                {user?.studentName ? user.studentName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                {user?.studentName || 'User'}
              </span>
              <span className="text-xs text-slate-400 line-clamp-1">
                {user?.email}
              </span>
            </div>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
