import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ShieldCheck, Lock, User, Check, ArrowRight, Info } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('STU2024001');
  const [password, setPassword] = useState('student123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotModal, setForgotModal] = useState(false);

  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(username, password, rememberMe);
    if (res.success) {
      if (res.user.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } else {
      setError(res.error || 'Invalid register number/email or password');
    }
  };

  const setDemoUser = (userType) => {
    if (userType === 'student') {
      setUsername('STU2024001');
      setPassword('student123');
    } else if (userType === 'admin') {
      setUsername('ADMIN001');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-xl shadow-indigo-500/25 mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">StudentHub</h1>
          <p className="text-sm text-slate-400 mt-1">Enterprise College & Student Management Portal</p>
        </div>

        {/* Demo Quick Fill Switcher */}
        <div className="glass-card p-3 rounded-xl mb-6 border border-indigo-500/20 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center">
            <Info className="w-4 h-4 mr-1.5 text-indigo-400" /> Quick Demo Credentials:
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setDemoUser('student')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 border border-indigo-500/30 transition-colors"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setDemoUser('admin')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-600/30 text-amber-300 hover:bg-amber-600/50 border border-amber-500/30 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6">Sign In to Your Account</h2>

          {error && (
            <div className="p-4 mb-6 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Register Number / Email / Admin ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. STU2024001 or admin@studenthub.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotModal(true)}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Don't have a student account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Register Student Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm glass-card p-6 rounded-2xl border border-slate-700 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Password Reset Assistance</h3>
            <p className="text-sm text-slate-400 mb-6">
              Please contact the College Administrative Office or Academic Controller to reset your portal password.
            </p>
            <button
              onClick={() => setForgotModal(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
