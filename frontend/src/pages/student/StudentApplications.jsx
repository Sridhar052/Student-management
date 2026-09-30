import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { FileText, Plus, Eye, Clock, CheckCircle2, AlertCircle, Calendar, Tag } from 'lucide-react';

const StudentApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [createModal, setCreateModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedAppDetails, setSelectedAppDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Form State
  const [newApp, setNewApp] = useState({
    applicationType: 'BONAFIDE_CERTIFICATE',
    title: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/students/me/applications');
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (id) => {
    setDetailModal(true);
    setLoadingDetails(true);
    try {
      const res = await api.get(`/applications/${id}`);
      if (res.success && res.data) {
        setSelectedAppDetails(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/students/me/applications', newApp);
      if (res.success && res.data) {
        setCreateModal(false);
        setNewApp({ applicationType: 'BONAFIDE_CERTIFICATE', title: '', description: '' });
        fetchApplications();
      }
    } catch (err) {
      alert(err.toString());
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    if (typeFilter && app.applicationType !== typeFilter) return false;
    if (statusFilter && app.status !== statusFilter) return false;
    return true;
  });

  if (loading) return <LoadingSpinner label="Loading Applications..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Application Portal</h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit, track, and manage official college service requests and certificates.
          </p>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Request / Application</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Tag className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">Category:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            <option value="SCHOLARSHIP">Scholarship Application</option>
            <option value="BONAFIDE_CERTIFICATE">Bonafide Certificate</option>
            <option value="HOSTEL_APPLICATION">Hostel Application</option>
            <option value="TRANSPORT_APPLICATION">Transport Application</option>
            <option value="LEAVE_APPLICATION">Leave Application</option>
            <option value="OTHER_REQUEST">Other College Requests</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApps.length > 0 ? (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">App ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Title & Description</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-400">
                      #APP-{app.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {app.applicationType?.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-semibold text-white line-clamp-1">{app.title}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{app.description}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {new Date(app.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetails(app.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors inline-flex items-center space-x-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
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
          title="No Applications Found"
          description="You have not submitted any applications matching the selected filters."
        />
      )}

      {/* Modal 1: Create Application */}
      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Submit New Request / Application"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Application Category
            </label>
            <select
              value={newApp.applicationType}
              onChange={(e) => setNewApp({ ...newApp, applicationType: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="BONAFIDE_CERTIFICATE">Bonafide Certificate</option>
              <option value="SCHOLARSHIP">Scholarship Application</option>
              <option value="HOSTEL_APPLICATION">Hostel Application</option>
              <option value="TRANSPORT_APPLICATION">Transport Application</option>
              <option value="LEAVE_APPLICATION">Leave Application</option>
              <option value="OTHER_REQUEST">Other College Request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Request Title / Subject
            </label>
            <input
              type="text"
              required
              value={newApp.title}
              onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
              placeholder="e.g. Bonafide Certificate for Bank Loan Renewal"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Detailed Reason & Particulars
            </label>
            <textarea
              required
              rows={4}
              value={newApp.description}
              onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
              placeholder="Provide complete details or context for your application..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Application Details & Status Timeline */}
      <Modal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        title="Application Details & Audit History"
      >
        {loadingDetails ? (
          <LoadingSpinner label="Fetching Application Timeline..." />
        ) : selectedAppDetails ? (
          <div className="space-y-6">
            {/* Header details */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400">
                  Application #APP-{selectedAppDetails.application.id}
                </span>
                <StatusBadge status={selectedAppDetails.application.status} />
              </div>
              <h3 className="text-base font-bold text-white">
                {selectedAppDetails.application.title}
              </h3>
              <p className="text-xs text-slate-300">
                {selectedAppDetails.application.description}
              </p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Category: {selectedAppDetails.application.applicationType}</span>
                <span>Submitted: {new Date(selectedAppDetails.application.submittedDate).toLocaleString()}</span>
              </div>
            </div>

            {/* Admin Remarks */}
            {selectedAppDetails.application.adminRemarks && (
              <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/30">
                <h4 className="text-xs font-bold text-indigo-300 mb-1">Administrative Remarks</h4>
                <p className="text-xs text-slate-200">{selectedAppDetails.application.adminRemarks}</p>
              </div>
            )}

            {/* Status History Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                Status Progression History
              </h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-slate-800">
                {selectedAppDetails.history && selectedAppDetails.history.length > 0 ? (
                  selectedAppDetails.history.map((h, idx) => (
                    <div key={h.id || idx} className="relative">
                      <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-slate-900" />
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <StatusBadge status={h.status} />
                          <span className="text-[10px] text-slate-500">
                            {new Date(h.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        {h.remarks && <p className="text-xs text-slate-300 mt-1">{h.remarks}</p>}
                        <span className="text-[10px] text-slate-500 block">By: {h.updatedBy || 'System Admin'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No status timeline events recorded.</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default StudentApplications;
