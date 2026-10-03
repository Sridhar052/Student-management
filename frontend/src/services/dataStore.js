// ==============================================================================
// StudentHub — Central Data Store & Persistence Layer (Hybrid Local + API Storage)
// ==============================================================================

const STORAGE_KEYS = {
  STUDENTS: 'studenthub_registered_students',
  APPLICATIONS: 'studenthub_applications',
  FEES: 'studenthub_fees',
  PAYMENTS: 'studenthub_payments',
  SCHOLARSHIPS: 'studenthub_scholarships',
  SCHOLARSHIP_APPS: 'studenthub_scholarship_applications',
  MARKS: 'studenthub_marks',
  DOCUMENTS: 'studenthub_documents',
  NOTIFICATIONS: 'studenthub_notifications',
};

// Initial Seed Data
const DEFAULT_STUDENTS = [
  {
    id: 1001,
    studentId: 'STU2026001',
    registerNumber: 'STU2026001',
    fullName: 'Aarav Sharma',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@studenthub.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 3,
    semester: 5,
    section: 'A',
    gender: 'Male',
    status: 'ACTIVE',
    gpa: 8.75,
    cgpa: 8.75,
    attendancePercentage: 94.5,
    joinedDate: '2023-08-15',
  },
  {
    id: 1002,
    studentId: 'STU2026002',
    registerNumber: 'STU2026002',
    fullName: 'Ananya Verma',
    firstName: 'Ananya',
    lastName: 'Verma',
    email: 'ananya.v@studenthub.edu',
    phone: '+91 98765 43211',
    department: 'Computer Science',
    course: 'B.Tech CSE',
    year: 2,
    semester: 3,
    section: 'B',
    gender: 'Female',
    status: 'ACTIVE',
    gpa: 9.12,
    cgpa: 9.10,
    attendancePercentage: 96.0,
    joinedDate: '2024-08-10',
  },
  {
    id: 1003,
    studentId: 'STU2026003',
    registerNumber: 'STU2026003',
    fullName: 'Rohan Gupta',
    firstName: 'Rohan',
    lastName: 'Gupta',
    email: 'rohan.gupta@studenthub.edu',
    phone: '+91 98765 43212',
    department: 'Information Technology',
    course: 'B.Tech IT',
    year: 4,
    semester: 7,
    section: 'A',
    gender: 'Male',
    status: 'ACTIVE',
    gpa: 8.20,
    cgpa: 8.15,
    attendancePercentage: 88.5,
    joinedDate: '2022-08-20',
  },
  {
    id: 1004,
    studentId: 'STU2026004',
    registerNumber: 'STU2026004',
    fullName: 'Priya Nair',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@studenthub.edu',
    phone: '+91 98765 43213',
    department: 'Electronics Engineering',
    course: 'B.Tech ECE',
    year: 1,
    semester: 1,
    section: 'A',
    gender: 'Female',
    status: 'ACTIVE',
    gpa: 8.90,
    cgpa: 8.90,
    attendancePercentage: 92.0,
    joinedDate: '2025-08-01',
  },
  {
    id: 1005,
    studentId: 'STU2026005',
    registerNumber: 'STU2026005',
    fullName: 'Vikram Patel',
    firstName: 'Vikram',
    lastName: 'Patel',
    email: 'vikram.p@studenthub.edu',
    phone: '+91 98765 43214',
    department: 'Mechanical Engineering',
    course: 'B.Tech Mech',
    year: 3,
    semester: 5,
    section: 'C',
    gender: 'Male',
    status: 'ACTIVE',
    gpa: 7.80,
    cgpa: 7.65,
    attendancePercentage: 85.0,
    joinedDate: '2023-08-15',
  }
];

const DEFAULT_SUBJECTS = [
  { id: 1, code: 'CS101', name: 'Data Structures & Algorithms', credits: 4, semester: 1, department: 'Computer Science' },
  { id: 2, code: 'CS102', name: 'Object Oriented Programming', credits: 3, semester: 1, department: 'Computer Science' },
  { id: 3, code: 'CS103', name: 'Mathematics I', credits: 4, semester: 1, department: 'Computer Science' },
  { id: 4, code: 'CS201', name: 'Database Management Systems', credits: 4, semester: 2, department: 'Computer Science' },
  { id: 5, code: 'CS202', name: 'Operating Systems', credits: 4, semester: 2, department: 'Computer Science' },
  { id: 6, code: 'CS301', name: 'Computer Networks', credits: 3, semester: 3, department: 'Computer Science' },
  { id: 7, code: 'CS302', name: 'Software Engineering', credits: 3, semester: 3, department: 'Computer Science' },
  { id: 8, code: 'CS401', name: 'Web Development & Cloud', credits: 4, semester: 4, department: 'Computer Science' },
  { id: 9, code: 'CS402', name: 'Artificial Intelligence & ML', credits: 4, semester: 4, department: 'Computer Science' },
];

const DEFAULT_APPLICATIONS = [
  {
    id: 501,
    studentId: 1001,
    studentName: 'Aarav Sharma',
    registerNumber: 'STU2026001',
    department: 'Computer Science',
    applicationType: 'BONAFIDE_CERTIFICATE',
    title: 'Bonafide Certificate for Education Loan',
    description: 'Require official bonafide certificate for bank loan processing.',
    status: 'APPROVED',
    submittedDate: '2026-09-25T10:30:00.000Z',
    adminRemarks: 'Verified and digital certificate issued.',
  },
  {
    id: 502,
    studentId: 1002,
    studentName: 'Ananya Verma',
    registerNumber: 'STU2026002',
    department: 'Computer Science',
    applicationType: 'SCHOLARSHIP',
    title: 'National Merit Tech Scholarship 2026',
    description: 'Applying under merit criteria (CGPA 9.12).',
    status: 'PENDING',
    submittedDate: '2026-10-01T14:15:00.000Z',
    adminRemarks: 'Under document verification.',
  },
  {
    id: 503,
    studentId: 1003,
    studentName: 'Rohan Gupta',
    registerNumber: 'STU2026003',
    department: 'Information Technology',
    applicationType: 'HOSTEL_APPLICATION',
    title: 'Hostel Room Allotment Request',
    description: 'Requesting single occupancy room for Semester 7.',
    status: 'PENDING',
    submittedDate: '2026-10-02T09:00:00.000Z',
    adminRemarks: null,
  }
];

const DEFAULT_FEES = [
  {
    id: 1,
    studentId: 1001,
    studentName: 'Aarav Sharma',
    registerNumber: 'STU2026001',
    feeType: 'Tuition Fee - Sem 5',
    amount: 45000,
    paidAmount: 45000,
    pendingAmount: 0,
    dueDate: '2026-09-30',
    status: 'PAID',
  },
  {
    id: 2,
    studentId: 1001,
    studentName: 'Aarav Sharma',
    registerNumber: 'STU2026001',
    feeType: 'Exam & Lab Fee - Sem 5',
    amount: 5000,
    paidAmount: 0,
    pendingAmount: 5000,
    dueDate: '2026-10-20',
    status: 'UNPAID',
  },
  {
    id: 3,
    studentId: 1002,
    studentName: 'Ananya Verma',
    registerNumber: 'STU2026002',
    feeType: 'Tuition Fee - Sem 3',
    amount: 45000,
    paidAmount: 20000,
    pendingAmount: 25000,
    dueDate: '2026-10-15',
    status: 'PARTIAL',
  }
];

const DEFAULT_PAYMENTS = [
  {
    id: 801,
    studentId: 1001,
    studentName: 'Aarav Sharma',
    registerNumber: 'STU2026001',
    feeType: 'Tuition Fee',
    amount: 45000,
    transactionId: 'TXN20260925001',
    paymentMode: 'ONLINE',
    paymentDate: '2026-09-25T11:20:00.000Z',
    status: 'SUCCESS',
  }
];

const DEFAULT_SCHOLARSHIPS = [
  {
    id: 1,
    title: 'National Merit Tech Scholarship 2026',
    description: 'Merit-based financial aid for engineering students with CGPA >= 8.5.',
    provider: 'Ministry of Education',
    amount: 50000,
    eligibilityCriteria: 'Minimum 85% in previous semesters, Family annual income < ₹8,00,000',
    academicYear: '2025-2026',
    status: 'ACTIVE',
  },
  {
    id: 2,
    title: 'Women in Tech Excellence Award',
    description: 'Scholarship supporting female undergraduate STEM scholars.',
    provider: 'Global Tech Foundation',
    amount: 75000,
    eligibilityCriteria: 'Female student enrolled in CS/IT/EC, CGPA >= 8.0',
    academicYear: '2025-2026',
    status: 'ACTIVE',
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Semester Examination Schedule Released',
    message: 'The final timetable for Semester 1, 3, 5 & 7 exams has been published. Check your student portal.',
    type: 'ANNOUNCEMENT',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: 2,
    title: 'Fee Payment Reminder',
    message: 'Last date for Semester Fee payment without late penalty is October 20, 2026.',
    type: 'REMINDER',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: false,
  }
];

// Data Store Class
class LocalDataStore {
  // Helper getters/setters for localStorage
  getItem(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  setItem(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // --- STUDENTS ---
  getRegisteredStudents() {
    const customStudents = this.getItem(STORAGE_KEYS.STUDENTS, []);
    const merged = [...DEFAULT_STUDENTS];

    customStudents.forEach((c) => {
      const idx = merged.findIndex(
        (m) => m.id === c.id || (m.registerNumber && m.registerNumber === c.registerNumber)
      );
      if (idx >= 0) {
        merged[idx] = { ...merged[idx], ...c };
      } else {
        merged.unshift(c);
      }
    });

    return merged;
  }

  addRegisteredStudent(studentData) {
    const currentCustom = this.getItem(STORAGE_KEYS.STUDENTS, []);
    const fullName = studentData.fullName || `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'New Student';
    const regNo = studentData.registerNumber || `STU2026${Math.floor(100 + Math.random() * 900)}`;

    const newStudent = {
      id: Date.now(),
      studentId: regNo,
      registerNumber: regNo,
      fullName: fullName,
      firstName: studentData.firstName || fullName.split(' ')[0] || 'Student',
      lastName: studentData.lastName || fullName.split(' ')[1] || '',
      email: studentData.email || `${regNo.toLowerCase()}@studenthub.edu`,
      phone: studentData.phone || '+91 98765 00000',
      department: studentData.department || 'Computer Science',
      course: studentData.course || 'B.Tech CSE',
      year: Number(studentData.year) || 1,
      semester: Number(studentData.semester) || 1,
      section: studentData.section || 'A',
      gender: studentData.gender || 'Other',
      status: 'ACTIVE',
      gpa: 8.5,
      cgpa: 8.5,
      attendancePercentage: 92.0,
      joinedDate: new Date().toISOString().split('T')[0],
      ...studentData,
    };

    currentCustom.unshift(newStudent);
    this.setItem(STORAGE_KEYS.STUDENTS, currentCustom);
    return newStudent;
  }

  updateStudent(studentData) {
    const currentCustom = this.getItem(STORAGE_KEYS.STUDENTS, []);
    const allStudents = this.getRegisteredStudents();
    const idx = allStudents.findIndex((s) => s.id === studentData.id || s.registerNumber === studentData.registerNumber);

    if (idx >= 0) {
      const updated = { ...allStudents[idx], ...studentData };
      const customIdx = currentCustom.findIndex((s) => s.id === studentData.id || s.registerNumber === studentData.registerNumber);
      if (customIdx >= 0) {
        currentCustom[customIdx] = updated;
      } else {
        currentCustom.push(updated);
      }
      this.setItem(STORAGE_KEYS.STUDENTS, currentCustom);
      return updated;
    }
    return studentData;
  }

  deactivateStudent(id) {
    const students = this.getRegisteredStudents();
    const target = students.find((s) => s.id === id);
    if (target) {
      target.status = 'INACTIVE';
      this.updateStudent(target);
    }
  }

  // --- DASHBOARDS ---
  getAdminDashboardSummary() {
    const students = this.getRegisteredStudents();
    const activeStudents = students.filter((s) => s.status === 'ACTIVE').length;
    const apps = this.getApplications();
    const pendingApps = apps.filter((a) => a.status === 'PENDING').length;
    const fees = this.getFees();
    const totalCollectedFees = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
    const totalPendingFees = fees.reduce((acc, f) => acc + (f.pendingAmount || 0), 0);
    const scholarships = this.getScholarships();

    const studentsByDepartment = {};
    students.forEach((s) => {
      const dept = s.department || 'Computer Science';
      studentsByDepartment[dept] = (studentsByDepartment[dept] || 0) + 1;
    });

    const applicationsByStatus = {
      PENDING: apps.filter((a) => a.status === 'PENDING').length,
      APPROVED: apps.filter((a) => a.status === 'APPROVED').length,
      REJECTED: apps.filter((a) => a.status === 'REJECTED').length,
      UNDER_REVIEW: apps.filter((a) => a.status === 'UNDER_REVIEW').length,
    };

    return {
      totalStudents: students.length,
      activeStudents: activeStudents,
      pendingApplications: pendingApps,
      totalCollectedFees: totalCollectedFees,
      totalPendingFees: totalPendingFees,
      scholarshipApplicationsCount: scholarships.length,
      studentsByDepartment: studentsByDepartment,
      applicationsByStatus: applicationsByStatus,
      recentApplications: apps.slice(0, 5),
      recentPayments: this.getPayments().slice(0, 5),
    };
  }

  getStudentDashboardSummary(currentUser) {
    const regNo = currentUser?.registerNumber || 'STU2026001';
    const students = this.getRegisteredStudents();
    const student = students.find((s) => s.registerNumber === regNo) || currentUser || students[0];

    const apps = this.getApplications().filter((a) => a.registerNumber === regNo || a.studentId === student.id);
    const fees = this.getFees().filter((f) => f.registerNumber === regNo || f.studentId === student.id);
    const pendingFee = fees.reduce((acc, f) => acc + (f.pendingAmount || 0), 0);
    const notifications = this.getNotifications();

    return {
      registerNumber: student.registerNumber,
      fullName: student.fullName || student.studentName || 'Student',
      department: student.department || 'Computer Science',
      currentSemester: student.semester || 1,
      cgpa: student.cgpa || 8.5,
      attendancePercentage: student.attendancePercentage || 92.0,
      pendingFee: pendingFee,
      totalApplications: apps.length,
      pendingApplications: apps.filter((a) => a.status === 'PENDING').length,
      scholarshipStatus: 'APPROVED (Merit 2026)',
      semesterGpas: { 1: 8.2, 2: 8.5, 3: 8.8, 4: student.cgpa || 8.75 },
      recentApplications: apps,
      recentNotifications: notifications,
      recentTransactions: this.getPayments().filter((p) => p.registerNumber === regNo),
    };
  }

  // --- SUBJECTS & MARKS ---
  getSubjects() {
    return DEFAULT_SUBJECTS;
  }

  getStudentMarks(studentId) {
    const students = this.getRegisteredStudents();
    const student = students.find((s) => s.id === Number(studentId) || s.registerNumber === studentId) || students[0];
    const customMarks = this.getItem(STORAGE_KEYS.MARKS, {});
    const studentMarksKey = student ? student.registerNumber : 'STU2026001';

    if (customMarks[studentMarksKey]) {
      return customMarks[studentMarksKey];
    }

    // Generate default marks summary
    return {
      studentId: student.id,
      registerNumber: student.registerNumber,
      studentName: student.fullName,
      cgpa: student.cgpa || 8.75,
      totalCreditsEarned: 45,
      semesters: {
        1: {
          gpa: 8.5,
          totalCredits: 11,
          marks: [
            { id: 1, subjectCode: 'CS101', subjectName: 'Data Structures & Algorithms', internalMarks: 27, externalMarks: 62, totalMarks: 89, grade: 'A+', gradePoint: 9, result: 'PASS' },
            { id: 2, subjectCode: 'CS102', subjectName: 'Object Oriented Programming', internalMarks: 25, externalMarks: 58, totalMarks: 83, grade: 'A', gradePoint: 8, result: 'PASS' },
            { id: 3, subjectCode: 'CS103', subjectName: 'Mathematics I', internalMarks: 28, externalMarks: 65, totalMarks: 93, grade: 'O', gradePoint: 10, result: 'PASS' },
          ]
        },
        2: {
          gpa: 8.8,
          totalCredits: 8,
          marks: [
            { id: 4, subjectCode: 'CS201', subjectName: 'Database Management Systems', internalMarks: 28, externalMarks: 64, totalMarks: 92, grade: 'O', gradePoint: 10, result: 'PASS' },
            { id: 5, subjectCode: 'CS202', subjectName: 'Operating Systems', internalMarks: 26, externalMarks: 60, totalMarks: 86, grade: 'A+', gradePoint: 9, result: 'PASS' },
          ]
        }
      }
    };
  }

  addMark(markData) {
    const customMarks = this.getItem(STORAGE_KEYS.MARKS, {});
    const students = this.getRegisteredStudents();
    const student = students.find((s) => s.id === Number(markData.studentId)) || students[0];
    const studentKey = student.registerNumber;

    const summary = this.getStudentMarks(studentKey);
    const sem = markData.semester || 1;
    const subjects = this.getSubjects();
    const sub = subjects.find((s) => s.id === Number(markData.subjectId)) || subjects[0];

    const internal = Number(markData.internalMarks) || 0;
    const external = Number(markData.externalMarks) || 0;
    const total = internal + external;
    const grade = total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : total >= 60 ? 'B+' : total >= 50 ? 'B' : 'F';
    const gradePoint = total >= 90 ? 10 : total >= 80 ? 9 : total >= 70 ? 8 : total >= 60 ? 7 : total >= 50 ? 6 : 0;

    const newMarkObj = {
      id: Date.now(),
      subjectCode: sub.code,
      subjectName: sub.name,
      internalMarks: internal,
      externalMarks: external,
      totalMarks: total,
      grade: grade,
      gradePoint: gradePoint,
      result: total >= 50 ? 'PASS' : 'FAIL',
    };

    if (!summary.semesters[sem]) {
      summary.semesters[sem] = { gpa: gradePoint, totalCredits: sub.credits, marks: [] };
    }
    summary.semesters[sem].marks.push(newMarkObj);
    customMarks[studentKey] = summary;
    this.setItem(STORAGE_KEYS.MARKS, customMarks);
    return newMarkObj;
  }

  deleteMark(markId, studentId) {
    const customMarks = this.getItem(STORAGE_KEYS.MARKS, {});
    const students = this.getRegisteredStudents();
    const student = students.find((s) => s.id === Number(studentId)) || students[0];
    const studentKey = student ? student.registerNumber : 'STU2026001';

    if (customMarks[studentKey]) {
      Object.keys(customMarks[studentKey].semesters).forEach((sem) => {
        customMarks[studentKey].semesters[sem].marks = customMarks[studentKey].semesters[sem].marks.filter(
          (m) => m.id !== Number(markId)
        );
      });
      this.setItem(STORAGE_KEYS.MARKS, customMarks);
    }
  }

  // --- APPLICATIONS ---
  getApplications() {
    const customApps = this.getItem(STORAGE_KEYS.APPLICATIONS, []);
    const merged = [...DEFAULT_APPLICATIONS];
    customApps.forEach((c) => {
      const idx = merged.findIndex((m) => m.id === c.id);
      if (idx >= 0) merged[idx] = c;
      else merged.unshift(c);
    });
    return merged;
  }

  submitApplication(appData, currentUser) {
    const customApps = this.getItem(STORAGE_KEYS.APPLICATIONS, []);
    const newApp = {
      id: Date.now(),
      studentId: currentUser?.id || 1001,
      studentName: currentUser?.fullName || currentUser?.studentName || 'Student User',
      registerNumber: currentUser?.registerNumber || 'STU2026001',
      department: currentUser?.department || 'Computer Science',
      applicationType: appData.applicationType || 'OTHER_REQUEST',
      title: appData.title || 'New Application Request',
      description: appData.description || '',
      status: 'PENDING',
      submittedDate: new Date().toISOString(),
      adminRemarks: null,
      ...appData,
    };
    customApps.unshift(newApp);
    this.setItem(STORAGE_KEYS.APPLICATIONS, customApps);
    return newApp;
  }

  updateApplicationStatus(id, status, remarks) {
    const apps = this.getApplications();
    const target = apps.find((a) => a.id === Number(id));
    if (target) {
      target.status = status;
      target.adminRemarks = remarks;
      const customApps = this.getItem(STORAGE_KEYS.APPLICATIONS, []);
      const idx = customApps.findIndex((a) => a.id === Number(id));
      if (idx >= 0) customApps[idx] = target;
      else customApps.push(target);
      this.setItem(STORAGE_KEYS.APPLICATIONS, customApps);
    }
    return target;
  }

  // --- FEES & PAYMENTS ---
  getFees() {
    const customFees = this.getItem(STORAGE_KEYS.FEES, []);
    const merged = [...DEFAULT_FEES];
    customFees.forEach((c) => {
      const idx = merged.findIndex((m) => m.id === c.id);
      if (idx >= 0) merged[idx] = c;
      else merged.unshift(c);
    });
    return merged;
  }

  getPayments() {
    const customPayments = this.getItem(STORAGE_KEYS.PAYMENTS, []);
    return [...customPayments, ...DEFAULT_PAYMENTS];
  }

  payFee(feeId, amount, paymentMode = 'ONLINE') {
    const fees = this.getFees();
    const fee = fees.find((f) => f.id === Number(feeId));
    if (fee) {
      const payAmount = Number(amount) || fee.pendingAmount;
      fee.paidAmount = (fee.paidAmount || 0) + payAmount;
      fee.pendingAmount = Math.max(0, fee.amount - fee.paidAmount);
      fee.status = fee.pendingAmount === 0 ? 'PAID' : 'PARTIAL';

      const customFees = this.getItem(STORAGE_KEYS.FEES, []);
      const fIdx = customFees.findIndex((f) => f.id === Number(feeId));
      if (fIdx >= 0) customFees[fIdx] = fee;
      else customFees.push(fee);
      this.setItem(STORAGE_KEYS.FEES, customFees);

      // Add payment txn
      const newTxn = {
        id: Date.now(),
        studentId: fee.studentId,
        studentName: fee.studentName,
        registerNumber: fee.registerNumber,
        feeType: fee.feeType,
        amount: payAmount,
        transactionId: 'TXN' + Date.now(),
        paymentMode: paymentMode,
        paymentDate: new Date().toISOString(),
        status: 'SUCCESS',
      };
      const payments = this.getItem(STORAGE_KEYS.PAYMENTS, []);
      payments.unshift(newTxn);
      this.setItem(STORAGE_KEYS.PAYMENTS, payments);
      return newTxn;
    }
    return null;
  }

  // --- SCHOLARSHIPS ---
  getScholarships() {
    return DEFAULT_SCHOLARSHIPS;
  }

  getScholarshipApplications() {
    return this.getApplications().filter((a) => a.applicationType === 'SCHOLARSHIP');
  }

  // --- NOTIFICATIONS & REPORTS ---
  getNotifications() {
    const customN = this.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    return [...customN, ...DEFAULT_NOTIFICATIONS];
  }

  markNotificationRead(id) {
    const customN = this.getItem(STORAGE_KEYS.NOTIFICATIONS, []);
    const n = customN.find((item) => item.id === Number(id));
    if (n) {
      n.read = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, customN);
    }
  }

  getDocuments() {
    return [
      { id: 1, name: 'HSC_12th_Marksheet.pdf', category: 'ACADEMIC', status: 'VERIFIED', uploadedAt: '2025-08-15' },
      { id: 2, name: 'Transfer_Certificate.pdf', category: 'IDENTITY', status: 'VERIFIED', uploadedAt: '2025-08-15' },
      { id: 3, name: 'Aadhaar_Card_Copy.pdf', category: 'IDENTITY', status: 'VERIFIED', uploadedAt: '2025-08-15' },
      { id: 4, name: 'Income_Certificate_2026.pdf', category: 'FINANCIAL', status: 'PENDING', uploadedAt: '2026-10-01' },
    ];
  }
}

export const dataStore = new LocalDataStore();
export default dataStore;
