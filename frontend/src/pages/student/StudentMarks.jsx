import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import { BookOpen, Printer, Download, Award, TrendingUp, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StudentMarks = () => {
  const { user } = useAuth();
  const [academicSummary, setAcademicSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSem, setActiveSem] = useState('ALL');

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    let summary = null;
    try {
      const res = await api.get('/students/me/academic-summary');
      if (res && res.success && res.data) {
        summary = res.data;
      }
    } catch (err) {
      console.warn('Backend marks summary API offline, loading from dataStore:', err);
    }

    if (!summary) {
      summary = dataStore.getStudentMarks(user?.registerNumber || user?.email || user?.id || 'STU2026001');
    }

    setAcademicSummary(summary);
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <LoadingSpinner label="Loading Academic Marksheet Data..." />;

  const semesters = academicSummary?.semesters || {};
  const semKeys = Object.keys(semesters).map(Number).sort((a, b) => a - b);

  const chartData = semKeys.map((sem) => ({
    semester: `Sem ${sem}`,
    gpa: semesters[sem].gpa,
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Academic Marksheet & Performance</h1>
          <p className="text-sm text-slate-400 mt-1">
            Official semester marksheets, grade points, GPA and CGPA analytics.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all self-start md:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download Official Marksheet</span>
        </button>
      </div>

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Cumulative Grade Point Average</span>
            <h2 className="text-3xl font-extrabold text-emerald-400">
              {academicSummary?.cgpa ? academicSummary.cgpa.toFixed(2) : '0.00'}
            </h2>
            <span className="text-[11px] text-slate-500">10.0 Grading Scale Standard</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Evaluated Semesters</span>
            <h2 className="text-3xl font-extrabold text-white">{semKeys.length} Semesters</h2>
            <span className="text-[11px] text-slate-500">All subjects cleared</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
          <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Student Info</span>
            <h2 className="text-lg font-bold text-white">{academicSummary?.studentName}</h2>
            <span className="text-xs font-mono text-indigo-400">{academicSummary?.registerNumber}</span>
          </div>
        </div>
      </div>

      {/* GPA Progression Chart */}
      {chartData.length > 0 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 no-print">
          <h3 className="text-lg font-bold text-white mb-4">Semester GPA Performance Chart</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="semester" stroke="#94a3b8" />
                <YAxis domain={[0, 10]} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="gpa" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Marksheet Layout Header (visible on print) */}
      <div className="hidden print-only mb-6 text-center border-b pb-4">
        <h1 className="text-2xl font-bold uppercase text-black">StudentHub Institute of Technology</h1>
        <h2 className="text-lg font-semibold text-gray-700">Official Consolidated Statement of Grades</h2>
        <div className="flex justify-between text-xs mt-4">
          <span>Student Name: {academicSummary?.studentName}</span>
          <span>Register Number: {academicSummary?.registerNumber}</span>
          <span>CGPA: {academicSummary?.cgpa}</span>
        </div>
      </div>

      {/* Semester Tables */}
      <div className="space-y-6">
        {semKeys.length > 0 ? (
          semKeys.map((sem) => {
            const semData = semesters[sem];
            const marksList = semData.marks || [];

            return (
              <div key={sem} className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                {/* Semester Table Header */}
                <div className="p-4 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="p-2 bg-indigo-600/20 text-indigo-400 font-bold rounded-lg text-sm">
                      SEMESTER {sem}
                    </span>
                    <span className="text-xs text-slate-400">
                      Total Credits: {semData.totalCredits}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 mr-2">Semester GPA:</span>
                    <span className="text-lg font-extrabold text-emerald-400">{semData.gpa.toFixed(2)}</span>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                      <tr>
                        <th className="px-5 py-3">Code</th>
                        <th className="px-5 py-3">Subject Name</th>
                        <th className="px-5 py-3">Credits</th>
                        <th className="px-5 py-3 text-center">Internal (30)</th>
                        <th className="px-5 py-3 text-center">External (70)</th>
                        <th className="px-5 py-3 text-center">Total (100)</th>
                        <th className="px-5 py-3 text-center">Grade</th>
                        <th className="px-5 py-3 text-center">Grade Point</th>
                        <th className="px-5 py-3 text-right">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {marksList.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-800/30">
                          <td className="px-5 py-3.5 font-mono font-bold text-indigo-400">{m.subjectCode}</td>
                          <td className="px-5 py-3.5 font-semibold text-white">{m.subjectName}</td>
                          <td className="px-5 py-3.5 text-slate-400">{m.credits}</td>
                          <td className="px-5 py-3.5 text-center font-mono">{m.internalMarks}</td>
                          <td className="px-5 py-3.5 text-center font-mono">{m.externalMarks}</td>
                          <td className="px-5 py-3.5 text-center font-mono font-bold text-white">{m.totalMarks}</td>
                          <td className="px-5 py-3.5 text-center font-bold text-amber-400">{m.grade}</td>
                          <td className="px-5 py-3.5 text-center font-mono font-semibold">{m.gradePoint}</td>
                          <td className="px-5 py-3.5 text-right">
                            <StatusBadge status={m.result} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 glass-card rounded-2xl">
            No marks records published yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentMarks;
