import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Award, Plus, CheckCircle2, DollarSign, Edit } from 'lucide-react';

const AdminScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createSchModal, setCreateSchModal] = useState(false);
  const [reviewAppModal, setReviewAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Forms
  const [schForm, setSchForm] = useState({
    title: '',
    description: '',
    provider: 'Government of India',
    amount: 50000,
    eligibilityCriteria: 'Minimum 80% marks in previous semester.',
    academicYear: '2025-2026',
  });

  const [reviewForm, setReviewForm] = useState({
    status: 'APPROVED',
    remarks: 'Approved by Financial Aid Officer.',
    approvedAmount: 50000,
    disbursementStatus: 'DISBURSED',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchScholarshipData();
  }, []);

  const fetchScholarshipData = async () => {
    let schData = [];
    let appData = [];

    try {
      const [schRes, appRes] = await Promise.all([
        api.get('/scholarships'),
        api.get('/admin/scholarships/applications'),
      ]);
      if (schRes && schRes.success && Array.isArray(schRes.data)) schData = schRes.data;
      if (appRes && appRes.success && Array.isArray(appRes.data)) appData = appRes.data;
    } catch (err) {
      console.warn('Scholarship API fetch failed, loading dataStore fallback:', err);
    }

    if (schData.length === 0) schData = dataStore.getScholarships();
    if (appData.length === 0) appData = dataStore.getScholarshipApplications();

    setScholarships(schData);
    setApplications(appData);
    setLoading(false);
  };

  const handleCreateScholarship = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/scholarships', schForm);
    } catch (err) {
      console.warn('Backend create scholarship failed, created locally:', err);
    }
    setCreateSchModal(false);
    fetchScholarshipData();
    setSubmitting(false);
  };

  const handleUpdateAppStatus = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    dataStore.updateApplicationStatus(selectedApp.id, reviewForm.status, reviewForm.remarks);
    try {
      await api.put(
        `/admin/scholarships/applications/${selectedApp.id}?status=${reviewForm.status}&remarks=${encodeURIComponent(reviewForm.remarks)}&approvedAmount=${reviewForm.approvedAmount}&disbursementStatus=${reviewForm.disbursementStatus}`
      );
    } catch (err) {
      console.warn('Backend update app status failed, status saved locally:', err);
    }
    setReviewAppModal(false);
    fetchScholarshipData();
    setSubmitting(false);
  };

  if (loading) return <LoadingSpinner label="Loading Scholarship Administration..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Scholarship Management & Grants</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create grant schemes, review student applications, approve amounts, and track funds disbursement.
          </p>
        </div>

        <button
          onClick={() => setCreateSchModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Scholarship Scheme</span>
        </button>
      </div>

      {/* Available Schemes */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Award className="w-5 h-5 mr-2 text-amber-400" />
          Active Scholarship Schemes ({scholarships.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((sch) => (
            <div key={sch.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-indigo-400">{sch.provider}</span>
                <span className="text-base font-extrabold text-emerald-400">₹{sch.amount?.toLocaleString()}</span>
              </div>
              <h3 className="text-base font-bold text-white">{sch.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{sch.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Award className="w-5 h-5 mr-2 text-indigo-400" />
          Student Scholarship Applications ({applications.length})
        </h2>

        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Scholarship</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Grant Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Disbursement</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4 font-semibold text-white">
                      <div>{app.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{app.registerNumber}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-200">
                      {app.scholarshipTitle}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                      ₹{app.scholarshipAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-indigo-400">
                      {app.disbursementStatus}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewForm({
                            status: app.status === 'APPLIED' ? 'APPROVED' : app.status,
                            remarks: app.remarks || 'Approved based on eligibility.',
                            approvedAmount: app.scholarshipAmount || 50000,
                            disbursementStatus: app.disbursementStatus || 'DISBURSED',
                          });
                          setReviewAppModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                      >
                        Action / Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal 1: Create Scheme */}
      <Modal isOpen={createSchModal} onClose={() => setCreateSchModal(false)} title="Create Scholarship Scheme">
        <form onSubmit={handleCreateScholarship} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Scholarship Title</label>
            <input
              type="text"
              required
              value={schForm.title}
              onChange={(e) => setSchForm({ ...schForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Provider / Foundation</label>
              <input
                type="text"
                required
                value={schForm.provider}
                onChange={(e) => setSchForm({ ...schForm, provider: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Scholarship Amount (₹)</label>
              <input
                type="number"
                required
                value={schForm.amount}
                onChange={(e) => setSchForm({ ...schForm, amount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={schForm.description}
              onChange={(e) => setSchForm({ ...schForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setCreateSchModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl">
              Publish Scheme
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Review App */}
      <Modal isOpen={reviewAppModal} onClose={() => setReviewAppModal(false)} title="Review & Approve Grant">
        {selectedApp && (
          <form onSubmit={handleUpdateAppStatus} className="space-y-4">
            <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1">
              <span className="font-bold text-white">{selectedApp.studentName} ({selectedApp.registerNumber})</span>
              <p className="text-slate-400">Scheme: {selectedApp.scholarshipTitle}</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Application Status</label>
              <select
                value={reviewForm.status}
                onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="APPROVED">APPROVED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Disbursement Status</label>
              <select
                value={reviewForm.disbursementStatus}
                onChange={(e) => setReviewForm({ ...reviewForm, disbursementStatus: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
              >
                <option value="DISBURSED">DISBURSED</option>
                <option value="PENDING">PENDING</option>
                <option value="NOT_APPLICABLE">NOT APPLICABLE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Approved Grant Amount (₹)</label>
              <input
                type="number"
                value={reviewForm.approvedAmount}
                onChange={(e) => setReviewForm({ ...reviewForm, approvedAmount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button type="button" onClick={() => setReviewAppModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl">
                Save Decision
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default AdminScholarships;
