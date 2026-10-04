import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Award, CheckCircle2, DollarSign, Calendar, Info, FileText } from 'lucide-react';

const StudentScholarships = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSch, setSelectedSch] = useState(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    let schData = [];
    let myData = [];

    try {
      const [allRes, myRes] = await Promise.all([
        api.get('/scholarships'),
        api.get('/students/me/scholarships'),
      ]);
      if (allRes && allRes.success && Array.isArray(allRes.data)) schData = allRes.data;
      if (myRes && myRes.success && Array.isArray(myRes.data)) myData = myRes.data;
    } catch (err) {
      console.warn('Scholarships API offline, loading dataStore fallback:', err);
    }

    if (schData.length === 0) schData = dataStore.getScholarships();
    if (myData.length === 0) {
      const regNo = user?.registerNumber;
      const email = user?.email;
      myData = dataStore.getScholarshipApplications().filter((a) => (regNo && a.registerNumber === regNo) || (email && a.email === email) || (user?.id && a.studentId === user.id));
    }

    setScholarships(schData);
    setMyApplications(myData);
    setLoading(false);
  };

  const handleApply = async (scholarshipId) => {
    setApplying(true);
    setMessage('');

    dataStore.submitApplication(
      {
        applicationType: 'SCHOLARSHIP',
        scholarshipId: scholarshipId,
        title: selectedSch?.title || 'Scholarship Application',
        description: selectedSch?.description || 'Applied via student portal.',
      },
      user
    );

    try {
      await api.post(`/students/me/scholarships/${scholarshipId}/apply`);
    } catch (err) {
      console.warn('Backend scholarship application failed, recorded locally:', err);
    }

    setMessage('Application submitted successfully!');
    setSelectedSch(null);
    fetchData();
    setApplying(false);
  };

  if (loading) return <LoadingSpinner label="Loading Scholarships Portal..." />;

  const appliedIds = new Set(myApplications.map((a) => a.scholarshipId));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Scholarships & Financial Aid</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore government & institutional merit scholarships, track applications and disbursements.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm rounded-xl">
          {message}
        </div>
      )}

      {/* Applied Scholarships Section */}
      {myApplications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Award className="w-5 h-5 mr-2 text-indigo-400" />
            My Scholarship Applications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myApplications.map((app) => (
              <div key={app.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {app.provider}
                  </span>
                  <StatusBadge status={app.status} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{app.scholarshipTitle}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-slate-400">Award Amount:</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      ₹{app.scholarshipAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    <span className="block text-[10px] text-slate-500">Applied Date</span>
                    <span>{new Date(app.applicationDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Disbursement Status</span>
                    <span className="font-semibold text-indigo-400">{app.disbursementStatus || 'PENDING'}</span>
                  </div>
                </div>

                {app.remarks && (
                  <div className="p-3 bg-slate-900/60 rounded-xl text-xs text-slate-300">
                    <span className="font-semibold text-slate-400">Remarks: </span>
                    {app.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Scholarships Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center">
          <Award className="w-5 h-5 mr-2 text-emerald-400" />
          Available Scholarships ({scholarships.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scholarships.map((sch) => {
            const hasApplied = appliedIds.has(sch.id);
            return (
              <div key={sch.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {sch.academicYear}
                    </span>
                    <span className="text-lg font-extrabold text-emerald-400">
                      ₹{sch.amount?.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mt-3">{sch.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{sch.description}</p>

                  <div className="mt-4 p-3 bg-slate-900/60 rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-slate-300 block">Eligibility Criteria:</span>
                    <p className="text-slate-400">{sch.eligibilityCriteria}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Provider: {sch.provider}</span>
                  {hasApplied ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedSch(sch)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scholarship Details / Confirm Apply Modal */}
      <Modal
        isOpen={!!selectedSch}
        onClose={() => setSelectedSch(null)}
        title={selectedSch?.title || 'Scholarship Application'}
      >
        {selectedSch && (
          <div className="space-y-5">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-indigo-400 font-semibold">{selectedSch.provider}</span>
                <span className="text-lg font-bold text-emerald-400">₹{selectedSch.amount?.toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-300">{selectedSch.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Eligibility Guidelines
              </h4>
              <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl">
                {selectedSch.eligibilityCriteria}
              </p>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
              Note: By clicking "Confirm Application", your academic CGPA score and student details will be attached automatically for review by the scholarship board.
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedSch(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(selectedSch.id)}
                disabled={applying}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {applying ? 'Submitting Application...' : 'Confirm Application'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentScholarships;
