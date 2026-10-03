import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { CreditCard, DollarSign, ArrowUpRight, CheckCircle2, FileText, Download, ShieldCheck, Sparkles } from 'lucide-react';

const StudentFees = () => {
  const { user } = useAuth();
  const [feeSummary, setFeeSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pay Modal
  const [payModal, setPayModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('ONLINE');
  const [paying, setPaying] = useState(false);

  // Receipt Modal
  const [receiptModal, setReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchFeeData();
  }, []);

  const fetchFeeData = async () => {
    let feeData = null;
    let payList = [];

    try {
      const [sumRes, payRes] = await Promise.all([
        api.get('/students/me/fees'),
        api.get('/students/me/payments'),
      ]);
      if (sumRes && sumRes.success && sumRes.data) feeData = sumRes.data;
      if (payRes && payRes.success && Array.isArray(payRes.data)) payList = payRes.data;
    } catch (err) {
      console.warn('Student fees API offline, loading from dataStore:', err);
    }

    if (!feeData) {
      const regNo = user?.registerNumber || 'STU2026001';
      const userFees = dataStore.getFees().filter((f) => f.registerNumber === regNo || f.studentId === user?.id);
      const totalFee = userFees.reduce((acc, f) => acc + (f.amount || 0), 0);
      const paidAmount = userFees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
      const pendingAmount = userFees.reduce((acc, f) => acc + (f.pendingAmount || 0), 0);

      feeData = {
        totalFee: totalFee || 50000,
        paidAmount: paidAmount || 45000,
        pendingAmount: pendingAmount || 5000,
        status: pendingAmount === 0 ? 'PAID' : 'PENDING',
        feeBreakdown: userFees.length > 0 ? userFees : dataStore.getFees(),
      };
    }

    if (payList.length === 0) {
      const regNo = user?.registerNumber || 'STU2026001';
      payList = dataStore.getPayments().filter((p) => p.registerNumber === regNo || p.studentId === user?.id);
    }

    setFeeSummary(feeData);
    setPayments(payList);
    setLoading(false);
  };

  const handleOpenPay = (fee) => {
    setSelectedFee(fee);
    setPayAmount(fee.pendingAmount);
    setPayModal(true);
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setPaying(true);

    const newTxn = dataStore.payFee(selectedFee.id, payAmount, payMethod);

    try {
      const res = await api.post('/students/me/payments/pay', {
        studentFeeId: selectedFee.id,
        amount: parseFloat(payAmount),
        paymentMethod: payMethod,
        remarks: 'Payment via Online Portal',
      });
      if (res && res.success && res.data) {
        setSelectedReceipt(res.data);
      } else {
        setSelectedReceipt(newTxn);
      }
    } catch (err) {
      console.warn('Backend payment API failed, payment recorded locally:', err);
      setSelectedReceipt(newTxn);
    }

    setPayModal(false);
    setReceiptModal(true);
    fetchFeeData();
    setPaying(false);
  };

  if (loading) return <LoadingSpinner label="Loading Fee Accounts & History..." />;

  const totalFee = feeSummary?.totalFee || 0;
  const paidFee = feeSummary?.paidFee || 0;
  const pendingFee = feeSummary?.pendingFee || 0;
  const paidPercent = totalFee > 0 ? Math.round((paidFee / totalFee) * 100) : 0;

  const breakdown = feeSummary?.feesBreakdown || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Fee Management & Payment Portal</h1>
        <p className="text-sm text-slate-400 mt-1">
          View tuition & lab fee breakdowns, make secure online fee payments and download official receipts.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">TOTAL ACADEMIC FEE</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">₹{totalFee.toLocaleString()}</h2>
          <span className="text-[11px] text-slate-500">Academic Year 2025-2026</span>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">PAID AMOUNT</span>
          <h2 className="text-3xl font-extrabold text-emerald-400 mt-1">₹{paidFee.toLocaleString()}</h2>
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all" style={{ width: `${paidPercent}%` }} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">TOTAL PENDING FEE</span>
          <h2 className="text-3xl font-extrabold text-rose-400 mt-1">₹{pendingFee.toLocaleString()}</h2>
          <span className="text-[11px] text-rose-300/80 block mt-1">
            {pendingFee > 0 ? 'Action Required' : 'All clear - No dues'}
          </span>
        </div>
      </div>

      {/* Fee Breakdown Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-indigo-400" />
          Fee Component Breakdown
        </h2>

        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
                <tr>
                  <th className="px-6 py-4">Fee Category</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Paid Amount</th>
                  <th className="px-6 py-4">Pending Amount</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {breakdown.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">
                      {fee.feeType} Fee
                    </td>
                    <td className="px-6 py-4 font-mono">₹{fee.totalAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400">₹{fee.paidAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-rose-400 font-bold">₹{fee.pendingAmount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{fee.dueDate || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={fee.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {fee.pendingAmount > 0 ? (
                        <button
                          onClick={() => handleOpenPay(fee)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all inline-flex items-center space-x-1"
                        >
                          <span>Pay Fee</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-medium inline-flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Clear
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Transaction History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <FileText className="w-5 h-5 mr-2 text-purple-400" />
          Payment History & Receipts
        </h2>

        {payments.length > 0 ? (
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700/60">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Receipt No</th>
                    <th className="px-6 py-4">Fee Type</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-400">{p.transactionId}</td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-300">{p.receiptNumber}</td>
                      <td className="px-6 py-4 font-semibold text-white">{p.feeType}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(p.paymentDate).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-300">{p.paymentMethod}</td>
                      <td className="px-6 py-4 font-mono font-bold text-emerald-400">
                        ₹{p.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedReceipt(p);
                            setReceiptModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold border border-indigo-500/30 inline-flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 glass-card rounded-2xl">
            No fee payment transactions recorded yet.
          </div>
        )}
      </div>

      {/* Pay Fee Modal */}
      <Modal
        isOpen={payModal}
        onClose={() => setPayModal(false)}
        title={`Pay ${selectedFee?.feeType} Fee`}
      >
        {selectedFee && (
          <form onSubmit={handleProcessPayment} className="space-y-4">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">Total Outstanding Balance</span>
                <span className="text-xl font-bold text-rose-400">
                  ₹{selectedFee.pendingAmount?.toLocaleString()}
                </span>
              </div>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold">
                Due: {selectedFee.dueDate || 'Immediate'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Payment Amount (₹)
              </label>
              <input
                type="number"
                required
                min={1}
                max={selectedFee.pendingAmount}
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-base focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select Payment Gateway Method
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ONLINE">UPI / QR Code Scan (Instant)</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="UPI">Google Pay / PhonePe / Paytm</option>
              </select>
            </div>

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <span>256-bit Encrypted Secure Payment Gateway Simulation Mode.</span>
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setPayModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={paying}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-600/30 disabled:opacity-50"
              >
                {paying ? 'Processing Payment...' : `Complete Payment of ₹${parseFloat(payAmount || 0).toLocaleString()}`}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Official Receipt Modal */}
      <Modal
        isOpen={receiptModal}
        onClose={() => setReceiptModal(false)}
        title="Official Fee Payment Receipt"
      >
        {selectedReceipt && (
          <div className="space-y-6">
            <div className="p-6 bg-white text-slate-900 rounded-2xl space-y-4 border shadow-inner">
              <div className="text-center border-b pb-3">
                <h2 className="text-lg font-bold uppercase text-slate-900">StudentHub College of Technology</h2>
                <p className="text-xs text-slate-600">Official Payment Acknowledgement Receipt</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Receipt Number:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Transaction ID:</span>
                  <span className="font-bold text-slate-900 font-mono">{selectedReceipt.transactionId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Student Name:</span>
                  <span className="font-semibold text-slate-900">{selectedReceipt.studentName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Register Number:</span>
                  <span className="font-semibold text-slate-900 font-mono">{selectedReceipt.registerNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Fee Type Paid:</span>
                  <span className="font-semibold text-slate-900">{selectedReceipt.feeType} Fee</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Payment Date:</span>
                  <span className="font-semibold text-slate-900">{new Date(selectedReceipt.paymentDate).toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl flex justify-between items-center text-sm font-bold border">
                <span>Amount Paid:</span>
                <span className="text-emerald-700 text-lg">₹{selectedReceipt.amount?.toLocaleString()}</span>
              </div>

              <div className="text-[10px] text-center text-slate-500 pt-2 border-t">
                Computer-generated official receipt. No physical signature required.
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentFees;
