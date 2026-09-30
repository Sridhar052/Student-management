# 🎓 StudentHub — Enterprise Student Management System

A full-stack, production-ready Student Management System built with **Java Spring Boot**, **React.js**, **Tailwind CSS**, and **Supabase PostgreSQL**.

---

## 🌟 Key Features

### 👤 Student Features
- **Secure JWT Authentication**: Login using Register Number / Student ID, remember me, password validation.
- **Personalized Student Dashboard**: Summary cards for Semester, CGPA, Attendance, Pending Fee, Scholarship Status, and Applications.
- **Academic Performance Charts**: Semester-by-semester GPA progression bar chart and CGPA tracking.
- **Complete Profile Management**: View & edit personal contact details, residential address, guardian details, and profile photo.
- **Applications Module**: Request Bonafide Certificates, Leave, Hostel, Transport, and Scholarship aid. Track status history timelines and admin remarks.
- **Academic & Marksheet Module**: View subject-wise internal, external marks, total score, grade points, semester GPA, and overall CGPA. Download or print official marksheets.
- **Scholarships Module**: Browse merit schemes, apply online, track eligibility criteria, approval status, and financial disbursements.
- **Fee Management & Payment Gateway Simulation**: Breakdown of Tuition, Exam, Hostel, Library, and Lab fees. Pay pending dues online and generate official PDF payment receipts.
- **Document Management**: Access official ID cards, transcripts, community & income certificates.
- **Live Notifications**: Unread badges for fee reminders, exam results, and college announcements.

### 🛡️ Admin Features
- **Executive Admin Dashboard**: High-level metrics for student counts, fee collections, pending dues, scholarship grants, and application status distribution charts.
- **Student Information Management**: Add new students, search by ID/Name/Register No, filter by department/year/status, edit profiles, and deactivate accounts.
- **Academic Gradebook**: Input & edit internal (0-30) and external (0-70) subject marks with automatic calculation of total marks, grades, grade points, GPA, and CGPA.
- **Application Review Board**: Review student service requests, approve/reject applications, attach administrative remarks, and record decision audit logs.
- **Fee Structure & Collection Ledger**: Assign fee components to students, set due dates, record offline/online payments, and monitor uncollected dues.
- **Scholarship Scheme Management**: Create new scholarship schemes, approve student grant applications, set awarded amounts, and mark funds disbursement.
- **Institutional Reports & CSV Export**: Generate audit reports for students, fee collections, pending dues, and applications with CSV export and printing options.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Axios |
| **Backend** | Java 17/25, Spring Boot 3.3.4, Spring Data JPA, Spring Security, JWT (jjwt 0.12.5) |
| **Database** | Supabase PostgreSQL (`db.tctecdannkhtjgxuwyol.supabase.co`) + H2 In-Memory Fallback |
| **Build Tools** | Maven 3.9, Vite 6 |

---

## 📂 Project Structure

```
studenthub/
├── .env                              # Environment variables (Supabase & JWT secrets)
├── .env.example                      # Environment variables template
├── README.md                         # Complete Documentation
├── backend/                          # Spring Boot REST API Service
│   ├── pom.xml
│   └── src/main/java/com/studenthub/
│       ├── config/                   # Security & DataInitializer (Seed Data)
│       ├── controller/               # Auth, Student, Mark, Application, Fee, Admin Controllers
│       ├── dto/                      # Request/Response DTOs & Validation
│       ├── entity/                   # JPA Entities (User, Student, Mark, Application, Fee, etc.)
│       ├── enums/                    # Role, ApplicationStatus, FeeType, etc.
│       ├── exception/                # GlobalExceptionHandler & Custom Exceptions
│       ├── repository/               # Spring Data JPA Repositories
│       ├── security/                 # JWT Authentication Filter, TokenProvider, UserDetails
│       └── service/                  # Business Logic & Service Implementations
└── frontend/                         # React SPA
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/               # Navbar, Sidebar, StatusBadge, Modal, LoadingSpinner
        ├── context/                  # AuthContext (JWT & Session management)
        ├── layouts/                  # StudentLayout, AdminLayout
        ├── pages/
        │   ├── Login.jsx             # Login with Demo Credentials Switcher
        │   ├── Register.jsx          # Student Self-Registration
        │   ├── student/              # Student Dashboard, Profile, Marks, Fees, Apps, etc.
        │   └── admin/                # Admin Dashboard, Students, Marks, Fees, Reports, etc.
        └── services/                 # Axios client with Bearer Token Interceptor
```

---

## 🔑 Default Development Credentials

For instant testing, use the pre-configured seed accounts:

### 🛡️ Admin Account
- **Register Number / ID**: `ADMIN001` or `admin@studenthub.com`
- **Password**: `admin123`
- **Role**: `ROLE_ADMIN`

### 👤 Student Account (Sample 1)
- **Register Number / ID**: `STU2024001` or `aarav@studenthub.com`
- **Password**: `student123`
- **Role**: `ROLE_STUDENT`

---

## ⚙️ Environment Configuration

### Root `.env`
```env
# Supabase PostgreSQL Database Credentials
DB_URL=jdbc:postgresql://db.tctecdannkhtjgxuwyol.supabase.co:5432/postgres?sslmode=require
DB_USERNAME=postgres
DB_PASSWORD=StudentHub2026Secure!

# JWT Secret Configuration
JWT_SECRET=StudentHubSecureJWTSecretKeyMustBeAtLeast32BytesLongForHS256Algorithm2026!
JWT_EXPIRATION=86400000

# Active Profile (postgres or h2)
SPRING_PROFILES_ACTIVE=postgres

# Supabase API Details
SUPABASE_URL=https://tctecdannkhtjgxuwyol.supabase.co
SUPABASE_ANON_KEY=sb_publishable_vi3jJ9GloGNe2s9w0h8vuQ_r0vpuwlV
```

---

## 🚀 How to Run the Application

### 1️⃣ Run Spring Boot Backend
Navigate to `backend` directory:
```bash
cd backend
mvn spring-boot:run
```
*The Spring Boot REST API server will start at `http://localhost:8080`.*

### 2️⃣ Run React Frontend
Navigate to `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
*The React application will launch at `http://localhost:5173`.*

---

## 📡 REST API Documentation

### 🔓 Authentication (`/api/auth`)
- `POST /api/auth/login`: Authenticate student/admin and return JWT token
- `POST /api/auth/register`: Self-register a new student account

### 👤 Student Endpoints (`/api/students`)
- `GET /api/students/me`: Fetch logged-in student profile
- `PUT /api/students/me`: Update allowed profile contact & guardian fields
- `GET /api/students/me/dashboard`: Fetch student dashboard metrics, GPAs, transactions

### 📚 Academic & Marks Endpoints (`/api/students/me/marks`, `/api/admin/marks`)
- `GET /api/students/me/marks`: Get student marks list
- `GET /api/students/me/academic-summary`: Get semester-wise GPA & CGPA summary
- `POST /api/admin/marks`: Input internal & external subject marks (Admin)
- `DELETE /api/admin/marks/{id}`: Delete mark record (Admin)

### 📝 Applications Endpoints (`/api/applications`)
- `GET /api/students/me/applications`: Get current student requests
- `POST /api/students/me/applications`: Submit new application request
- `GET /api/applications/{id}`: Get application detail & timeline history
- `GET /api/admin/applications`: View all student applications with filters (Admin)
- `PUT /api/admin/applications/{id}/status`: Approve or reject application (Admin)

### 💳 Fee Management Endpoints (`/api/fees`)
- `GET /api/students/me/fees`: Fetch fee breakdown (Tuition, Exam, Hostel, Lab)
- `GET /api/students/me/payments`: Fetch payment history & transaction IDs
- `POST /api/students/me/payments/pay`: Process online fee payment and generate receipt
- `POST /api/admin/fees`: Create and assign fee structures (Admin)

### 📊 Reports & Admin Dashboard (`/api/admin`)
- `GET /api/admin/dashboard`: Fetch institutional overview metrics & analytics
- `GET /api/admin/reports`: Generate student master, fee collection, dues, & application reports
