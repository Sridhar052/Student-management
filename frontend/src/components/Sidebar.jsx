import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FileText,
  Award,
  CreditCard,
  Folder,
  Bell,
  Settings,
  Users,
  BookOpen,
  BarChart3,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth();

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'Applications', path: '/student/applications', icon: FileText },
    { name: 'Academic / Marks', path: '/student/marks', icon: BookOpen },
    { name: 'Scholarships', path: '/student/scholarships', icon: Award },
    { name: 'Fee Details', path: '/student/fees', icon: CreditCard },
    { name: 'Documents', path: '/student/documents', icon: Folder },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
    { name: 'Settings', path: '/student/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Marks Management', path: '/admin/marks', icon: BookOpen },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Scholarships', path: '/admin/scholarships', icon: Award },
    { name: 'Fee Management', path: '/admin/fees', icon: CreditCard },
    { name: 'Documents', path: '/admin/documents', icon: Folder },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="py-6 px-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
              Menu Navigation
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer info card */}
        <div className="p-4 border-t border-slate-800/80 m-4 rounded-xl bg-slate-800/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Portal Status</span>
            <span className="inline-flex items-center text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              Online
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            StudentHub v1.0.0 Enterprise
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
