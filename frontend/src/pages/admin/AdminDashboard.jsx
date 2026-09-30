import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  Users,
  FileText,
  CreditCard,
  Award,
  TrendingUp,
  AlertCircle,
  Building,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Admin Dashboard Analytics..." />;

  const deptData = data?.studentsByDepartment
    ? Object.keys(data.studentsByDepartment).map((dept) => ({
        name: dept,
        count: data.studentsByDepartment[dept],
      }))
    : [];

  const appStatusData = data?.applicationsByStatus
    ? Object.keys(data.applicationsByStatus).map((st) => ({
        name: st.replace(/_/g, ' '),
        value: data.applicationsByStatus[st],
      }))
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card p-6 lg:p-8 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Administrator Oversight Control
            </span>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mt-2">
              College Executive Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Centralized monitoring of student admissions, fee collections, marks, and applications.
            </p>
          </div>
          <Link
            to="/admin/reports"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold shadow-lg shadow-amber-600/30 transition-all self-start md:self-auto"
          >
            Generate System Reports
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Students */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Students</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{data?.totalStudents || 0}</span>
            <span className="text-xs text-emerald-400 block mt-1">
              {data?.activeStudents || 0} Active Status
            </span>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-amber-400">{data?.pendingApplications || 0}</span>
            <Link to="/admin/applications" className="text-xs text-indigo-400 hover:underline block mt-1">
              Review Now &rarr;
            </Link>
          </div>
        </div>

        {/* Collected Fees */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Fee Collected</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-emerald-400">
              ₹{(data?.totalCollectedFees || 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 block mt-1">Total revenue</span>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Dues</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rose-400">
              ₹{(data?.totalPendingFees || 0).toLocaleString()}
            </span>
            <Link to="/admin/fees" className="text-xs text-indigo-400 hover:underline block mt-1">
              Manage Dues &rarr;
            </Link>
          </div>
        </div>

        {/* Scholarships */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Scholarship Apps</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{data?.scholarshipApplicationsCount || 0}</span>
            <Link to="/admin/scholarships" className="text-xs text-indigo-400 hover:underline block mt-1">
              View Applications &rarr;
            </Link>
          </div>
        </div>

        {/* Departments */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 glass-card-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Departments</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-white">{deptData.length}</span>
            <span className="text-xs text-slate-400 block mt-1">Active Branches</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Students per Department */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4">Student Enrollment by Department</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#818cf8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Applications Status Pie */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-4">Application Requests Status Distribution</h3>
          <div className="h-64 w-full flex items-center justify-center">
            {appStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {appStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-500">No application data for visualization.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Student Applications</h3>
            <Link to="/admin/applications" className="text-xs text-indigo-400 hover:underline">
              Manage Applications
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentApplications && data.recentApplications.length > 0 ? (
              data.recentApplications.map((app) => (
                <div key={app.id} className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.studentName} ({app.registerNumber})</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{app.title}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No recent applications.</p>
            )}
          </div>
        </div>

        {/* Recent Fee Payments */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Recent Fee Collections</h3>
            <Link to="/admin/fees" className="text-xs text-indigo-400 hover:underline">
              Manage Fee Accounts
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentPayments && data.recentPayments.length > 0 ? (
              data.recentPayments.map((p) => (
                <div key={p.id} className="p-3.5 bg-slate-800/40 rounded-xl border border-slate-700/40 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{p.studentName} ({p.registerNumber})</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.feeType} Fee • Txn: {p.transactionId}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">
                    +₹{p.amount?.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No recent payments recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
