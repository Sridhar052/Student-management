import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { CreditCard, Plus, CheckCircle2, DollarSign } from 'lucide-react';

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addFeeModal, setAddFeeModal] = useState(false);
  const [feeForm, setFeeForm] = useState({
    studentId: '',
    feeType: 'TUITION',
    totalAmount: 60000,
    academicYear: '2025-2026',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    let feeList = [];
    let stuList = [];

    try {
      const [feeRes, stuRes] = await Promise.all([
        api.get('/admin/fees'),
        api.get('/admin/students'),
      ]);
      if (feeRes && feeRes.success && Array.isArray(feeRes.data)) feeList = feeRes.data;
      if (stuRes && stuRes.success && Array.isArray(stuRes.data)) stuList = stuRes.data;
    } catch (err) {
      console.warn('Fee API fetch error, loading local dataStore fees:', err);
    }

    if (feeList.length === 0) feeList = dataStore.getFees();
    if (stuList.length === 0) stuList = dataStore.getRegisteredStudents();

    setFees(feeList);
    setStudents(stuList);
    if (stuList.length > 0) {
      setFeeForm((prev) => ({ ...prev, studentId: stuList[0].id }));
    }
    setLoading(false);
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/fees', {
        ...feeForm,
        studentId: parseInt(feeForm.studentId),
        totalAmount: parseFloat(feeForm.totalAmount),
      });
    } catch (err) {
      console.warn('Backend create fee failed:', err);
    }
    setAddFeeModal(false);
    fetchFeeData();
    setSubmitting(false);
  };

  if (loading) return <LoadingSpinner label="Loading Fee Management System..." />;

  const totalAllocated = fees.reduce((acc, f) => acc + (f.totalAmount || 0), 0);
  const totalPaid = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalPending = fees.reduce((acc, f) => acc + (f.pendingAmount || 0), 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Fee Structure & Dues Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Assign tuition, hostel, exam fees to students and monitor collection ledgers.
          </p>
        </div>

        <button
          onClick={() => setAddFeeModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Fee to Student</span>
        </button>
      </div>

      {/* Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Billed Fees</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">₹{totalAllocated.toLocaleString()}</h2>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Collected Amount</span>
          <h2 className="text-2xl font-extrabold text-emerald-400 mt-1">₹{totalPaid.toLocaleString()}</h2>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Uncollected Dues</span>
          <h2 className="text-2xl font-extrabold text-rose-400 mt-1">₹{totalPending.toLocaleString()}</h2>
        </div>
      </div>

      {/* Student Fees Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/60 font-bold text-white text-sm border-b border-slate-700/60">
          All Student Fee Accounts ({fees.length})
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Register No</th>
                <th className="px-6 py-4">Fee Type</th>
                <th className="px-6 py-4">Total Fee</th>
                <th className="px-6 py-4">Paid Amount</th>
                <th className="px-6 py-4">Pending Dues</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {fees.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-semibold text-white">{f.studentName}</td>
                  <td className="px-6 py-4 font-mono text-xs text-indigo-400">{f.registerNumber}</td>
                  <td className="px-6 py-4 font-semibold text-slate-200">{f.feeType} Fee</td>
                  <td className="px-6 py-4 font-mono">₹{f.totalAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-emerald-400">₹{f.paidAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-rose-400 font-bold">₹{f.pendingAmount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={f.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Fee */}
      <Modal isOpen={addFeeModal} onClose={() => setAddFeeModal(false)} title="Assign Fee Component">
        <form onSubmit={handleCreateFee} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Student</label>
            <select
              value={feeForm.studentId}
              onChange={(e) => setFeeForm({ ...feeForm, studentId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName} ({s.registerNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Fee Type</label>
              <select
                value={feeForm.feeType}
                onChange={(e) => setFeeForm({ ...feeForm, feeType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
              >
                <option value="TUITION">TUITION</option>
                <option value="EXAM">EXAM</option>
                <option value="HOSTEL">HOSTEL</option>
                <option value="TRANSPORT">TRANSPORT</option>
                <option value="LIBRARY">LIBRARY</option>
                <option value="LABORATORY">LABORATORY</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Total Fee Amount (₹)</label>
              <input
                type="number"
                required
                value={feeForm.totalAmount}
                onChange={(e) => setFeeForm({ ...feeForm, totalAmount: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setAddFeeModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl">
              Assign Fee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFees;
