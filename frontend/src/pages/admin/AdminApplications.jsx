import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { FileText, CheckCircle2, XCircle, Clock, Filter, Eye } from 'lucide-react';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  // Review Modal
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('APPROVED');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [typeFilter, statusFilter, deptFilter]);

  const fetchApplications = async () => {
    let list = [];
    try {
      let url = '/admin/applications?';
      if (typeFilter) url += `type=${typeFilter}&`;
      if (statusFilter) url += `status=${statusFilter}&`;
      if (deptFilter) url += `department=${encodeURIComponent(deptFilter)}&`;

      const res = await api.get(url);
      if (res && res.success && Array.isArray(res.data)) {
        list = res.data;
      }
    } catch (err) {
      console.warn('Applications API fetch error, reading local dataStore applications:', err);
    }

    if (list.length === 0) {
      list = dataStore.getApplications();
    }

    // Apply filtering
    if (typeFilter) {
      list = list.filter((a) => a.applicationType === typeFilter);
    }
    if (statusFilter) {
      list = list.filter((a) => a.status === statusFilter);
    }
    if (deptFilter) {
      list = list.filter((a) => a.department === deptFilter);
    }

    setApplications(list);
    setLoading(false);
  };

  const handleOpenReview = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status === 'PENDING' ? 'APPROVED' : app.status);
    setRemarks(app.adminRemarks || '');
    setReviewModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    dataStore.updateApplicationStatus(selectedApp.id, newStatus, remarks);

    try {
      await api.put(`/admin/applications/${selectedApp.id}/status`, {
        status: newStatus,
        remarks: remarks,
      });
    } catch (err) {
      console.warn('Backend status update API failed, status updated locally:', err);
    }

    setReviewModal(false);
    fetchApplications();
    setSubmitting(false);
  };

  if (loading) return <LoadingSpinner label="Loading Application Submissions..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Student Application Review Board</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review, approve, or reject student certificate, bonafide, hostel, and scholarship requests.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="">All Categories</option>
            <option value="SCHOLARSHIP">Scholarship Application</option>
            <option value="BONAFIDE_CERTIFICATE">Bonafide Certificate</option>
            <option value="HOSTEL_APPLICATION">Hostel Application</option>
            <option value="TRANSPORT_APPLICATION">Transport Application</option>
            <option value="LEAVE_APPLICATION">Leave Application</option>
            <option value="OTHER_REQUEST">Other Request</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Department</label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics Engineering">Electronics Engineering</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {applications.length > 0 ? (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">App ID</th>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Type & Title</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-400">
                      #APP-{app.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>{app.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{app.registerNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">{app.department}</td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-slate-200">{app.applicationType}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{app.title}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(app.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenReview(app)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition-colors inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Application Submissions"
          description="There are no student applications matching your current filter criteria."
        />
      )}

      {/* Review & Update Modal */}
      <Modal
        isOpen={reviewModal}
        onClose={() => setReviewModal(false)}
        title="Review & Update Application Status"
      >
        {selectedApp && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-indigo-400">#APP-{selectedApp.id}</span>
                <span className="text-slate-400">{selectedApp.studentName} ({selectedApp.registerNumber})</span>
              </div>
              <h3 className="text-sm font-bold text-white">{selectedApp.title}</h3>
              <p className="text-xs text-slate-300">{selectedApp.description}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Set Application Decision Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="APPROVED">APPROVED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="REJECTED">REJECTED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Administrative Remarks & Instructions
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter approval details or reason for rejection..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Save Decision'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminApplications;
