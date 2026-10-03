import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { BookOpen, Plus, Trash2, Edit, Save, Calculator } from 'lucide-react';

const AdminMarks = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedSem, setSelectedSem] = useState(1);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add/Edit Mark Form State
  const [markForm, setMarkForm] = useState({
    studentId: '',
    subjectId: '',
    internalMarks: 25,
    externalMarks: 60,
    semester: 1,
    academicYear: '2025-2026',
  });
  const [addMarkModal, setAddMarkModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentSummary(selectedStudentId);
    }
  }, [selectedStudentId]);

  const initData = async () => {
    let stuData = [];
    let subData = [];

    try {
      const [stuRes, subRes] = await Promise.all([
        api.get('/admin/students'),
        api.get('/subjects'),
      ]);
      if (stuRes && stuRes.success && Array.isArray(stuRes.data)) stuData = stuRes.data;
      if (subRes && subRes.success && Array.isArray(subRes.data)) subData = subRes.data;
    } catch (err) {
      console.warn('Backend API for marks init unavailable, using dataStore:', err);
    }

    if (stuData.length === 0) stuData = dataStore.getRegisteredStudents();
    if (subData.length === 0) subData = dataStore.getSubjects();

    setStudents(stuData);
    setSubjects(subData);
    if (stuData.length > 0) {
      setSelectedStudentId(stuData[0].id);
    }
    setLoading(false);
  };

  const fetchStudentSummary = async (studentId) => {
    try {
      const res = await api.get(`/admin/marks/student/${studentId}`);
      if (res && res.success && res.data) {
        setSummary(res.data);
        return;
      }
    } catch (err) {
      console.warn('Marks summary API error, loading local dataStore marks summary:', err);
    }

    const localSummary = dataStore.getStudentMarks(studentId);
    setSummary(localSummary);
  };

  const handleSaveMark = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    dataStore.addMark({
      ...markForm,
      studentId: selectedStudentId,
      semester: selectedSem,
    });

    try {
      await api.post('/admin/marks', {
        ...markForm,
        studentId: parseInt(selectedStudentId),
        subjectId: parseInt(markForm.subjectId),
        internalMarks: parseFloat(markForm.internalMarks),
        externalMarks: parseFloat(markForm.externalMarks),
        semester: parseInt(selectedSem),
      });
    } catch (err) {
      console.warn('Backend mark save failed, mark saved locally:', err);
    }

    setAddMarkModal(false);
    fetchStudentSummary(selectedStudentId);
    setSubmitting(false);
  };

  const handleDeleteMark = async (markId) => {
    if (!window.confirm('Delete this mark entry?')) return;

    dataStore.deleteMark(markId, selectedStudentId);

    try {
      await api.delete(`/admin/marks/${markId}`);
    } catch (err) {
      console.warn('Backend delete mark failed, mark removed locally:', err);
    }

    fetchStudentSummary(selectedStudentId);
  };

  if (loading) return <LoadingSpinner label="Loading Academic Gradebook..." />;

  const semesterData = summary?.semesters ? summary.semesters[selectedSem] : null;
  const currentMarks = semesterData?.marks || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Academic Mark & Gradebook Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Input subject internal/external marks, grade points, and auto-calculate GPA & CGPA.
          </p>
        </div>

        <button
          onClick={() => {
            if (subjects.length > 0) {
              setMarkForm({ ...markForm, subjectId: subjects[0].id, semester: selectedSem });
            }
            setAddMarkModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add / Input Subject Mark</span>
        </button>
      </div>

      {/* Selector Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Student</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName} ({s.registerNumber}) - {s.department}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Select Semester</label>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(parseInt(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Score Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Selected Student CGPA</span>
          <h2 className="text-2xl font-extrabold text-emerald-400 mt-1">
            {summary?.cgpa ? summary.cgpa.toFixed(2) : '0.00'}
          </h2>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Semester {selectedSem} GPA</span>
          <h2 className="text-2xl font-extrabold text-indigo-400 mt-1">
            {semesterData?.gpa ? semesterData.gpa.toFixed(2) : '0.00'}
          </h2>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Semester Credits</span>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            {semesterData?.totalCredits || 0} Credits
          </h2>
        </div>
      </div>

      {/* Marks Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-800/60 border-b border-slate-700/60 font-bold text-white text-sm">
          Subject Evaluation Ledger - Semester {selectedSem}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3">Subject Code</th>
                <th className="px-5 py-3">Subject Name</th>
                <th className="px-5 py-3 text-center">Internal (30)</th>
                <th className="px-5 py-3 text-center">External (70)</th>
                <th className="px-5 py-3 text-center">Total (100)</th>
                <th className="px-5 py-3 text-center">Grade</th>
                <th className="px-5 py-3 text-center">Grade Point</th>
                <th className="px-5 py-3 text-center">Result</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {currentMarks.length > 0 ? (
                currentMarks.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/30">
                    <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">{m.subjectCode}</td>
                    <td className="px-5 py-3.5 font-semibold text-white">{m.subjectName}</td>
                    <td className="px-5 py-3.5 text-center font-mono">{m.internalMarks}</td>
                    <td className="px-5 py-3.5 text-center font-mono">{m.externalMarks}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-white">{m.totalMarks}</td>
                    <td className="px-5 py-3.5 text-center font-bold text-amber-400">{m.grade}</td>
                    <td className="px-5 py-3.5 text-center font-mono font-semibold">{m.gradePoint}</td>
                    <td className="px-5 py-3.5 text-center">
                      <StatusBadge status={m.result} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteMark(m.id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-slate-500">
                    No marks entered for Semester {selectedSem} yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Input Mark Modal */}
      <Modal isOpen={addMarkModal} onClose={() => setAddMarkModal(false)} title="Input Subject Marks">
        <form onSubmit={handleSaveMark} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
            <select
              value={markForm.subjectId}
              onChange={(e) => setMarkForm({ ...markForm, subjectId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  [{sub.code}] {sub.name} (Sem {sub.semester})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Internal Marks (Max 30)</label>
              <input
                type="number"
                min={0}
                max={30}
                required
                value={markForm.internalMarks}
                onChange={(e) => setMarkForm({ ...markForm, internalMarks: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">External Marks (Max 70)</label>
              <input
                type="number"
                min={0}
                max={70}
                required
                value={markForm.externalMarks}
                onChange={(e) => setMarkForm({ ...markForm, externalMarks: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm"
              />
            </div>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300">
            Total & Grade points will be computed automatically according to academic regulations.
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setAddMarkModal(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
            >
              Save Mark Record
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMarks;
