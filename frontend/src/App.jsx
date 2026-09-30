import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentApplications from './pages/student/StudentApplications';
import StudentMarks from './pages/student/StudentMarks';
import StudentScholarships from './pages/student/StudentScholarships';
import StudentFees from './pages/student/StudentFees';
import StudentDocuments from './pages/student/StudentDocuments';
import StudentNotifications from './pages/student/StudentNotifications';
import StudentSettings from './pages/student/StudentSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminMarks from './pages/admin/AdminMarks';
import AdminApplications from './pages/admin/AdminApplications';
import AdminScholarships from './pages/admin/AdminScholarships';
import AdminFees from './pages/admin/AdminFees';
import AdminDocuments from './pages/admin/AdminDocuments';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

const RootRedirect = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return isAdmin ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="marks" element={<StudentMarks />} />
            <Route path="scholarships" element={<StudentScholarships />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="documents" element={<StudentDocuments />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="settings" element={<StudentSettings />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="marks" element={<AdminMarks />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="scholarships" element={<AdminScholarships />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
