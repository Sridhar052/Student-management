import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import dataStore from '../../services/dataStore';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Phone, Mail, MapPin, Building, Calendar, Shield, Save, Edit3, Lock, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    registerNumber: '',
    studentId: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    batch: '2023-2027',
    year: 1,
    semester: 1,
    section: 'A',
    admissionDate: '',
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
    let p = null;
    try {
      const res = await api.get('/students/me');
      if (res && res.success && res.data) {
        p = res.data;
      }
    } catch (err) {
      console.warn('Backend student profile API offline, loading from session/dataStore:', err);
    }

    if (!p) {
      const students = dataStore.getRegisteredStudents();
      const currentReg = user?.registerNumber;
      const currentEmail = user?.email;
      p = students.find((s) => (currentReg && s.registerNumber === currentReg) || (currentEmail && s.email === currentEmail) || (user?.id && s.id === user.id)) || user || students[0];
    }

    setProfile(p);
    setFormData({
      fullName: p?.fullName || p?.studentName || user?.fullName || 'Student',
      registerNumber: p?.registerNumber || user?.registerNumber || '',
      studentId: p?.studentId || p?.registerNumber || user?.registerNumber || '',
      dob: p?.dob || '2004-05-15',
      gender: p?.gender || 'Male',
      phone: p?.phone || '+91 98765 43210',
      email: p?.email || user?.email || 'student@studenthub.edu',
      address: p?.address || '123 Academic Block, Campus Avenue',
      city: p?.city || 'Chennai',
      district: p?.district || 'Chennai',
      state: p?.state || 'Tamil Nadu',
      pincode: p?.pincode || '600028',
      department: p?.department || user?.department || 'Computer Science',
      course: p?.course || user?.course || 'B.Tech CSE',
      batch: p?.batch || '2023-2027',
      year: p?.year || user?.year || 1,
      semester: p?.semester || user?.semester || 1,
      section: p?.section || 'A',
      admissionDate: p?.admissionDate || '2023-08-15',
      parentName: p?.parentName || '',
      parentRelation: p?.parentRelation || 'Father',
      parentPhone: p?.parentPhone || '',
      parentEmail: p?.parentEmail || '',
      profileImage: p?.profileImage || user?.profileImage || '',
    });
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setFormData((prev) => ({ ...prev, profileImage: base64Image }));
        setProfile((prev) => ({ ...prev, profileImage: base64Image }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const updatedProfile = {
      ...profile,
      ...formData,
      fullName: formData.fullName,
      firstName: formData.fullName.split(' ')[0] || formData.fullName,
      lastName: formData.fullName.split(' ').slice(1).join(' ') || '',
    };

    setProfile(updatedProfile);
    dataStore.updateStudent(updatedProfile);

    // Update global user context & localStorage
    updateUser({
      studentName: formData.fullName,
      fullName: formData.fullName,
      registerNumber: formData.registerNumber,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      course: formData.course,
      year: formData.year,
      semester: formData.semester,
      profileImage: formData.profileImage,
    });

    try {
      await api.put('/students/me', formData);
    } catch (err) {
      console.warn('Backend profile update failed, updated locally:', err);
    }

    setIsEditing(false);
    setMessage({ type: 'success', text: 'All profile details and picture updated successfully!' });
    setSaving(false);
  };

  if (loading) return <LoadingSpinner label="Loading Profile Data..." />;

  const displayImage =
    formData.profileImage ||
    profile?.profileImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card p-6 lg:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          {/* Profile Picture Upload Avatar */}
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            title="Click to upload profile photo"
          >
            <img
              src={displayImage}
              alt={formData.fullName || profile?.fullName}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-white">{formData.fullName || profile?.fullName}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {profile?.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1 font-mono">
              Register No: {formData.registerNumber || profile?.registerNumber} | Student ID:{' '}
              {formData.studentId || profile?.studentId}
            </p>
            <p className="text-xs text-indigo-400 mt-1 font-medium">
              {formData.course || profile?.course} • {formData.department || profile?.department} (Sem{' '}
              {formData.semester || profile?.semester})
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Profile Picture</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all ${
            isEditing
              ? 'bg-amber-600 text-white hover:bg-amber-500 shadow-lg shadow-amber-600/30'
              : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
          }`}
        >
          {isEditing ? <Lock className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          <span>{isEditing ? 'Done Editing' : 'Edit Profile Details'}</span>
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

      {/* Main Profile Details Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Personal Information */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-400" />
              Personal Information
            </span>
            {isEditing && <span className="text-xs text-indigo-400 font-normal">Editing Mode Active</span>}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                disabled={!isEditing}
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Register Number</label>
              <input
                type="text"
                name="registerNumber"
                disabled={!isEditing}
                value={formData.registerNumber}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm font-mono transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Student ID</label>
              <input
                type="text"
                name="studentId"
                disabled={!isEditing}
                value={formData.studentId}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm font-mono transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                disabled={!isEditing}
                value={formData.dob}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Gender</label>
              <select
                name="gender"
                disabled={!isEditing}
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                disabled={!isEditing}
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-slate-300 mb-1">Residential Address</label>
              <input
                type="text"
                name="address"
                disabled={!isEditing}
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">City</label>
              <input
                type="text"
                name="city"
                disabled={!isEditing}
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">District</label>
              <input
                type="text"
                name="district"
                disabled={!isEditing}
                value={formData.district}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">State</label>
              <input
                type="text"
                name="state"
                disabled={!isEditing}
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                disabled={!isEditing}
                value={formData.pincode}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 2. Academic Information */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-indigo-400" />
              Academic Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Department</label>
              <input
                type="text"
                name="department"
                disabled={!isEditing}
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Course</label>
              <input
                type="text"
                name="course"
                disabled={!isEditing}
                value={formData.course}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Batch</label>
              <input
                type="text"
                name="batch"
                disabled={!isEditing}
                value={formData.batch}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Year</label>
              <input
                type="number"
                name="year"
                min={1}
                max={4}
                disabled={!isEditing}
                value={formData.year}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Semester</label>
              <input
                type="number"
                name="semester"
                min={1}
                max={8}
                disabled={!isEditing}
                value={formData.semester}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Section</label>
              <input
                type="text"
                name="section"
                disabled={!isEditing}
                value={formData.section}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Admission Date</label>
              <input
                type="date"
                name="admissionDate"
                disabled={!isEditing}
                value={formData.admissionDate}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 rounded-xl text-sm transition-all ${
                  isEditing
                    ? 'bg-slate-900 border border-indigo-500/50 text-white focus:ring-2 focus:ring-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Overall CGPA</label>
              <div className="px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-bold text-sm">
                {profile?.cgpa ? profile.cgpa.toFixed(2) : '8.50'}
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
            <span className="text-xs text-slate-300">You have active edits in your profile.</span>
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
