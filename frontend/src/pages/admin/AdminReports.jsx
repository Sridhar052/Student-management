import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart3, Download, Printer, Filter, FileSpreadsheet } from 'lucide-react';

const AdminReports = () => {
  const [reportType, setReportType] = useState('STUDENT');
  const [department, setDepartment] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateReport();
  }, [reportType, department]);

  const generateReport = async () => {
    setLoading(true);
    let dataList = null;

    try {
      let url = `/admin/reports?type=${reportType}`;
      if (department) url += `&department=${encodeURIComponent(department)}`;
      const res = await api.get(url);
      if (res && res.success && res.data) {
        dataList = res.data;
      }
    } catch (err) {
      console.warn('Reports API fetch failed, computing report locally:', err);
    }

    if (!dataList) {
      if (reportType === 'STUDENT') {
        let students = dataStore.getRegisteredStudents();
        if (department) students = students.filter((s) => s.department === department);
        dataList = {
          count: students.length,
          data: students.map((s) => ({
            RegisterNo: s.registerNumber,
            StudentName: s.fullName,
            Department: s.department,
            Course: s.course,
            Year: s.year,
            Status: s.status,
            CGPA: s.cgpa || 8.5,
          })),
        };
      } else if (reportType === 'FEE_COLLECTION' || reportType === 'PENDING_FEE') {
        let fees = dataStore.getFees();
        if (reportType === 'PENDING_FEE') fees = fees.filter((f) => f.pendingAmount > 0);
        dataList = {
          count: fees.length,
          data: fees.map((f) => ({
            RegisterNo: f.registerNumber,
            StudentName: f.studentName,
            FeeType: f.feeType,
            TotalAmount: `₹${f.amount}`,
            PaidAmount: `₹${f.paidAmount || 0}`,
            PendingAmount: `₹${f.pendingAmount || 0}`,
            Status: f.status,
          })),
        };
      } else {
        let apps = dataStore.getApplications();
        if (department) apps = apps.filter((a) => a.department === department);
        dataList = {
          count: apps.length,
          data: apps.map((a) => ({
            AppID: `#APP-${a.id}`,
            StudentName: a.studentName,
            RegisterNo: a.registerNumber,
            Type: a.applicationType,
            Title: a.title,
            Status: a.status,
            SubmittedDate: new Date(a.submittedDate).toLocaleDateString(),
          })),
        };
      }
    }

    setReportData(dataList);
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (!reportData || !reportData.data) return;
    const items = reportData.data;
    if (items.length === 0) return;

    const headers = Object.keys(items[0]).join(',');
    const rows = items.map((obj) =>
      Object.values(obj)
        .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
        .join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StudentHub_${reportType}_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">System Reports & Data Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate, filter, and export comprehensive institutional reports for audits and compliance.
          </p>
        </div>

        <div className="flex space-x-3 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5"
          >
            <option value="STUDENT">Student Directory Master Report</option>
            <option value="FEE_COLLECTION">Fee Collection & Revenue Report</option>
            <option value="PENDING_FEE">Pending Fee Dues Report</option>
            <option value="APPLICATION">Student Applications Audit Report</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Filter by Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3.5 py-2.5"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics Engineering">Electronics Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
          </select>
        </div>
      </div>

      {/* Printable Report View */}
      {loading ? (
        <LoadingSpinner label="Generating Official Audit Report..." />
      ) : reportData ? (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">{reportType.replace(/_/g, ' ')} REPORT</h2>
              <span className="text-xs text-slate-400">Department: {department || 'ALL'}</span>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>Total Records: <span className="font-bold text-white">{reportData.count || 0}</span></div>
              <div>Generated: {new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">#</th>
                  {reportData.data && reportData.data.length > 0
                    ? Object.keys(reportData.data[0]).slice(0, 7).map((key) => (
                        <th key={key} className="px-4 py-3">{key.replace(/([A-Z])/g, ' $1')}</th>
                      ))
                    : null}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {reportData.data && reportData.data.length > 0 ? (
                  reportData.data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono text-slate-500">{idx + 1}</td>
                      {Object.values(item).slice(0, 7).map((val, i) => (
                        <td key={i} className="px-4 py-3 max-w-xs truncate">
                          {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-6 text-center text-slate-500">
                      No report records matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminReports;
