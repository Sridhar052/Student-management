import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Phone, Mail, MapPin, Building, Calendar, Shield, Save, Edit3, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    parentName: '',
    parentRelation: '',
    parentPhone: '',
    parentEmail: '',
    profileImage: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/me');
      if (res.success && res.data) {
        setProfile(res.data);
        setFormData({
          phone: res.data.phone || '',
          email: res.data.email || '',
          address: res.data.address || '',
          city: res.data.city || '',
          district: res.data.district || '',
          state: res.data.state || '',
          pincode: res.data.pincode || '',
          parentName: res.data.parentName || '',
          parentRelation: res.data.parentRelation || '',
          parentPhone: res.data.parentPhone || '',
          parentEmail: res.data.parentEmail || '',
          profileImage: res.data.profileImage || '',
        });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/students/me', formData);
      if (res.success && res.data) {
        setProfile(res.data);
        updateUser({ studentName: res.data.fullName });
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.toString() });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Profile Data..." />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 lg:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="relative">
            <img
              src={profile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={profile?.fullName}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">{profile?.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {profile?.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              Register No: {profile?.registerNumber} | Student ID: {profile?.studentId}
            </p>
            <p className="text-xs text-indigo-400 mt-1 font-medium">
              {profile?.course} • {profile?.department} (Sem {profile?.semester})
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all ${
            isEditing
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
          }`}
        >
          {isEditing ? <Lock className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? 'Cancel Edit' : 'Edit Allowed Fields'}</span>
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Profile Details Form / Grid */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Personal Information */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-indigo-400" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Register Number (Locked)</label>
              <input
                type="text"
                disabled
                value={profile?.registerNumber || ''}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Student ID (Locked)</label>
              <input
                type="text"
                disabled
                value={profile?.studentId || ''}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name (Locked)</label>
              <input
                type="text"
                disabled
                value={profile?.fullName || ''}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Date of Birth (Locked)</label>
              <input
                type="text"
                disabled
                value={profile?.dob || ''}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Gender (Locked)</label>
              <input
                type="text"
                disabled
                value={profile?.gender || ''}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Phone Number (Editable)</label>
              <input
                type="text"
                name="phone"
                disabled={!isEditing}
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Email Address (Editable)</label>
              <input
                type="email"
                name="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-300 mb-1">Residential Address (Editable)</label>
              <input
                type="text"
                name="address"
                disabled={!isEditing}
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">City (Editable)</label>
              <input
                type="text"
                name="city"
                disabled={!isEditing}
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">District (Editable)</label>
              <input
                type="text"
                name="district"
                disabled={!isEditing}
                value={formData.district}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">State (Editable)</label>
              <input
                type="text"
                name="state"
                disabled={!isEditing}
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Pincode (Editable)</label>
              <input
                type="text"
                name="pincode"
                disabled={!isEditing}
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 2. Academic Information (Locked to Admin) */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-indigo-400" />
              Academic Details (Admin Enforced)
            </h2>
            <span className="text-xs text-slate-400 flex items-center">
              <Lock className="w-3.5 h-3.5 mr-1 text-amber-400" /> Managed by College Admin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Department</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm">
                {profile?.department}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Course</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm">
                {profile?.course}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Batch</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm">
                {profile?.batch}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Year / Semester</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm">
                Year {profile?.year} (Semester {profile?.semester})
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Section</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm">
                Section {profile?.section}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Admission Date</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm">
                {profile?.admissionDate}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Overall CGPA</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold text-sm">
                {profile?.cgpa ? profile.cgpa.toFixed(2) : 'N/A'}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Attendance Percentage</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 font-bold text-sm">
                {profile?.attendancePercentage}%
              </div>
            </div>
          </div>
        </div>

        {/* 3. Guardian Information */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-indigo-400" />
            Guardian / Parent Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Parent/Guardian Name</label>
              <input
                type="text"
                name="parentName"
                disabled={!isEditing}
                value={formData.parentName}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm ${
                  isEditing ? 'bg-slate-900 border border-indigo-500/50 text-white' : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Relationship</label>
              <input
                type="text"
                name="parentRelation"
                disabled={!isEditing}
                value={formData.parentRelation}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm ${
                  isEditing ? 'bg-slate-900 border border-indigo-500/50 text-white' : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Guardian Phone</label>
              <input
                type="text"
                name="parentPhone"
                disabled={!isEditing}
                value={formData.parentPhone}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm ${
                  isEditing ? 'bg-slate-900 border border-indigo-500/50 text-white' : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Guardian Email</label>
              <input
                type="email"
                name="parentEmail"
                disabled={!isEditing}
                value={formData.parentEmail}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm ${
                  isEditing ? 'bg-slate-900 border border-indigo-500/50 text-white' : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Save Bar when editing */}
        {isEditing && (
          <div className="sticky bottom-4 z-20 glass-card p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between shadow-2xl bg-slate-900/90 backdrop-blur-xl">
            <span className="text-xs text-slate-300">You have unsaved edits in your profile.</span>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default StudentProfile;
