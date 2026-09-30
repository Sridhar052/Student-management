package com.studenthub.config;

import com.studenthub.entity.*;
import com.studenthub.enums.*;
import com.studenthub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private ScholarshipApplicationRepository scholarshipApplicationRepository;

    @Autowired
    private StudentFeeRepository studentFeeRepository;

    @Autowired
    private FeePaymentRepository feePaymentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationStatusHistoryRepository historyRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Data already initialized.");
            return;
        }

        System.out.println("Initializing StudentHub Database Seed Data...");

        // 1. Create Admin User
        User adminUser = new User();
        adminUser.setEmail("admin@studenthub.com");
        adminUser.setRegisterNumber("ADMIN001");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setRole(Role.ROLE_ADMIN);
        adminUser = userRepository.save(adminUser);

        // 2. Create Subjects
        Subject s1 = subjectRepository.save(new Subject(null, "CS101", "Data Structures & Algorithms", 4, 1, "Computer Science"));
        Subject s2 = subjectRepository.save(new Subject(null, "CS102", "Object Oriented Programming", 3, 1, "Computer Science"));
        Subject s3 = subjectRepository.save(new Subject(null, "CS103", "Mathematics I", 4, 1, "Computer Science"));
        Subject s4 = subjectRepository.save(new Subject(null, "CS201", "Database Management Systems", 4, 2, "Computer Science"));
        Subject s5 = subjectRepository.save(new Subject(null, "CS202", "Operating Systems", 4, 2, "Computer Science"));
        Subject s6 = subjectRepository.save(new Subject(null, "CS301", "Computer Networks", 3, 3, "Computer Science"));
        Subject s7 = subjectRepository.save(new Subject(null, "CS302", "Software Engineering", 3, 3, "Computer Science"));
        Subject s8 = subjectRepository.save(new Subject(null, "CS401", "Web Development & Cloud", 4, 4, "Computer Science"));
        Subject s9 = subjectRepository.save(new Subject(null, "CS402", "Artificial Intelligence & ML", 4, 4, "Computer Science"));

        // 3. Create Scholarships
        Scholarship sch1 = new Scholarship();
        sch1.setTitle("National Merit Tech Scholarship 2026");
        sch1.setDescription("Merit-based financial aid for engineering students with CGPA >= 8.5.");
        sch1.setProvider("Ministry of Education");
        sch1.setAmount(50000.0);
        sch1.setEligibilityCriteria("Minimum 85% in previous semesters, Family annual income < ₹8,00,000");
        sch1.setAcademicYear("2025-2026");
        sch1.setStatus("ACTIVE");
        sch1 = scholarshipRepository.save(sch1);

        Scholarship sch2 = new Scholarship();
        sch2.setTitle("Women in Tech Excellence Award");
        sch2.setDescription("Scholarship supporting female undergraduate STEM scholars.");
        sch2.setProvider("Global Tech Foundation");
        sch2.setAmount(75000.0);
        sch2.setEligibilityCriteria("Female student enrolled in CS/IT/EC, CGPA >= 8.0");
        sch2.setAcademicYear("2025-2026");
        sch2.setStatus("ACTIVE");
        sch2 = scholarshipRepository.save(sch2);

        // 4. Create 5 Students
        createStudentWithFullRecords(
                "STU2024001", "aarav@studenthub.com", "Aarav", "Sharma", "Male",
                LocalDate.of(2003, 5, 14), "9876543210", "12, MG Road, Koramangala", "Bengaluru",
                "Bengaluru Urban", "Karnataka", "560034", "Computer Science", "B.Tech CSE",
                "2023-2027", 2, 4, "A", "Rajesh Sharma", "Father", "9876500001",
                8.85, 8.85, 94.5, s1, s2, s3, s4, s5, s6, s7, s8, s9, sch1
        );

        createStudentWithFullRecords(
                "STU2024002", "ananya@studenthub.com", "Ananya", "Patel", "Female",
                LocalDate.of(2004, 2, 20), "9876543211", "45, Park Street", "Ahmedabad",
                "Ahmedabad", "Gujarat", "380009", "Information Technology", "B.Tech IT",
                "2023-2027", 2, 4, "B", "Suresh Patel", "Father", "9876500002",
                9.20, 9.20, 96.0, s1, s2, s3, s4, s5, s6, s7, s8, s9, sch2
        );

        createStudentWithFullRecords(
                "STU2024003", "rohan@studenthub.com", "Rohan", "Verma", "Male",
                LocalDate.of(2003, 11, 8), "9876543212", "78, Civil Lines", "Jaipur",
                "Jaipur", "Rajasthan", "302006", "Electronics Engineering", "B.Tech ECE",
                "2023-2027", 2, 3, "A", "Sunil Verma", "Father", "9876500003",
                8.40, 8.40, 89.0, s1, s2, s3, s4, s5, s6, s7, null, null, null
        );

        createStudentWithFullRecords(
                "STU2024004", "priya@studenthub.com", "Priya", "Nair", "Female",
                LocalDate.of(2004, 8, 30), "9876543213", "101, Marine Drive", "Kochi",
                "Ernakulam", "Kerala", "682031", "Computer Science", "B.Tech CSE",
                "2023-2027", 2, 4, "A", "Ramesh Nair", "Father", "9876500004",
                9.05, 9.05, 95.2, s1, s2, s3, s4, s5, s6, s7, s8, s9, sch2
        );

        createStudentWithFullRecords(
                "STU2024005", "vikram@studenthub.com", "Vikram", "Singh", "Male",
                LocalDate.of(2004, 1, 12), "9876543214", "56, Model Town", "Chandigarh",
                "Chandigarh", "Punjab", "160002", "Mechanical Engineering", "B.Tech ME",
                "2024-2028", 1, 2, "B", "Harpreet Singh", "Father", "9876500005",
                7.90, 7.90, 88.5, s1, s2, s3, s4, s5, null, null, null, null, null
        );

        System.out.println("StudentHub Seed Data Initialized Successfully!");
    }

    private void createStudentWithFullRecords(
            String regNo, String email, String fName, String lName, String gender,
            LocalDate dob, String phone, String address, String city, String district,
            String state, String pincode, String dept, String course, String batch,
            int year, int sem, String section, String pName, String pRel, String pPhone,
            double gpa, double cgpa, double attendance,
            Subject s1, Subject s2, Subject s3, Subject s4, Subject s5, Subject s6, Subject s7, Subject s8, Subject s9,
            Scholarship sch
    ) {
        User user = new User();
        user.setRegisterNumber(regNo);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("student123"));
        user.setRole(Role.ROLE_STUDENT);
        user = userRepository.save(user);

        Student student = new Student();
        student.setUser(user);
        student.setRegisterNumber(regNo);
        student.setStudentId("ID-" + regNo);
        student.setFirstName(fName);
        student.setLastName(lName);
        student.setGender(gender);
        student.setDob(dob);
        student.setPhone(phone);
        student.setEmail(email);
        student.setAddress(address);
        student.setCity(city);
        student.setDistrict(district);
        student.setState(state);
        student.setPincode(pincode);
        student.setDepartment(dept);
        student.setCourse(course);
        student.setBatch(batch);
        student.setYear(year);
        student.setSemester(sem);
        student.setSection(section);
        student.setAdmissionDate(LocalDate.of(2023, 8, 1));
        student.setParentName(pName);
        student.setParentRelation(pRel);
        student.setParentPhone(pPhone);
        student.setParentEmail(pName.toLowerCase().replace(" ", "") + "@gmail.com");
        student.setStatus("ACTIVE");
        student.setGpa(gpa);
        student.setCgpa(cgpa);
        student.setAttendancePercentage(attendance);
        student.setProfileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80");
        student = studentRepository.save(student);

        // Create Marks for Semesters
        if (s1 != null) createMark(student, s1, 28.0, 62.0, 1);
        if (s2 != null) createMark(student, s2, 27.0, 58.0, 1);
        if (s3 != null) createMark(student, s3, 29.0, 65.0, 1);

        if (s4 != null) createMark(student, s4, 26.0, 60.0, 2);
        if (s5 != null) createMark(student, s5, 29.0, 64.0, 2);

        if (s6 != null) createMark(student, s6, 27.0, 61.0, 3);
        if (s7 != null) createMark(student, s7, 28.0, 63.0, 3);

        if (s8 != null) createMark(student, s8, 29.0, 66.0, 4);
        if (s9 != null) createMark(student, s9, 30.0, 67.0, 4);

        // Fees
        StudentFee f1 = new StudentFee();
        f1.setStudent(student);
        f1.setFeeType(FeeType.TUITION);
        f1.setTotalAmount(60000.0);
        f1.setPaidAmount(60000.0);
        f1.setDueDate(LocalDate.now().minusDays(30));
        f1.setAcademicYear("2025-2026");
        f1.setStatus(FeeStatus.PAID);
        f1 = studentFeeRepository.save(f1);

        FeePayment fp1 = new FeePayment();
        fp1.setStudentFee(f1);
        fp1.setStudent(student);
        fp1.setTransactionId("TXN-" + regNo + "-01");
        fp1.setPaymentDate(LocalDateTime.now().minusDays(20));
        fp1.setAmount(60000.0);
        fp1.setPaymentMethod(PaymentMethod.ONLINE);
        fp1.setStatus(PaymentStatus.PAID);
        fp1.setReceiptNumber("RCPT-2026-" + regNo);
        fp1.setRemarks("Sem 4 Tuition Fee Paid in Full");
        feePaymentRepository.save(fp1);

        StudentFee f2 = new StudentFee();
        f2.setStudent(student);
        f2.setFeeType(FeeType.EXAM);
        f2.setTotalAmount(5000.0);
        f2.setPaidAmount(0.0);
        f2.setDueDate(LocalDate.now().plusDays(15));
        f2.setAcademicYear("2025-2026");
        f2.setStatus(FeeStatus.PENDING);
        studentFeeRepository.save(f2);

        StudentFee f3 = new StudentFee();
        f3.setStudent(student);
        f3.setFeeType(FeeType.LIBRARY);
        f3.setTotalAmount(2500.0);
        f3.setPaidAmount(2500.0);
        f3.setDueDate(LocalDate.now().minusDays(60));
        f3.setAcademicYear("2025-2026");
        f3.setStatus(FeeStatus.PAID);
        studentFeeRepository.save(f3);

        // Applications
        Application app1 = new Application();
        app1.setStudent(student);
        app1.setApplicationType(ApplicationType.BONAFIDE_CERTIFICATE);
        app1.setTitle("Bonafide Certificate for Bank Education Loan");
        app1.setDescription("Requesting Bonafide Certificate for processing SBI Education Loan renewal.");
        app1.setStatus(ApplicationStatus.APPROVED);
        app1.setAdminRemarks("Approved and issued by Academic Section.");
        app1 = applicationRepository.save(app1);

        historyRepository.save(new ApplicationStatusHistory(app1, ApplicationStatus.PENDING, "Submitted by student", fName));
        historyRepository.save(new ApplicationStatusHistory(app1, ApplicationStatus.APPROVED, "Approved by Academic Admin", "Admin"));

        Application app2 = new Application();
        app2.setStudent(student);
        app2.setApplicationType(ApplicationType.LEAVE_APPLICATION);
        app2.setTitle("Medical Leave Request (3 Days)");
        app2.setDescription("Requesting 3 days leave due to viral fever from Oct 1 to Oct 3.");
        app2.setStatus(ApplicationStatus.UNDER_REVIEW);
        app2.setAdminRemarks("Under verification by HOD.");
        app2 = applicationRepository.save(app2);

        historyRepository.save(new ApplicationStatusHistory(app2, ApplicationStatus.PENDING, "Submitted with medical certificate", fName));

        // Scholarship Application if applicable
        if (sch != null) {
            ScholarshipApplication schApp = new ScholarshipApplication();
            schApp.setScholarship(sch);
            schApp.setStudent(student);
            schApp.setStatus(ScholarshipStatus.APPROVED);
            schApp.setApprovedAmount(sch.getAmount());
            schApp.setDisbursementStatus("DISBURSED");
            schApp.setRemarks("Eligible. High academic standing.");
            schApp.setApprovedDate(LocalDateTime.now().minusDays(10));
            scholarshipApplicationRepository.save(schApp);
        }

        // Documents
        Document d1 = new Document();
        d1.setStudent(student);
        d1.setDocumentName("Student ID Card 2025-2026");
        d1.setDocumentType("ID_CARD");
        d1.setFileUrl("https://tctecdannkhtjgxuwyol.supabase.co/storage/v1/object/public/documents/" + regNo + "_id_card.pdf");
        d1.setFileSize("850 KB");
        d1.setStatus(DocumentStatus.VERIFIED);
        documentRepository.save(d1);

        Document d2 = new Document();
        d2.setStudent(student);
        d2.setDocumentName("Semester 3 Official Marksheet");
        d2.setDocumentType("MARKSHEET");
        d2.setFileUrl("https://tctecdannkhtjgxuwyol.supabase.co/storage/v1/object/public/documents/" + regNo + "_sem3_marksheet.pdf");
        d2.setFileSize("1.4 MB");
        d2.setStatus(DocumentStatus.VERIFIED);
        documentRepository.save(d2);

        // Notifications
        Notification n1 = new Notification();
        n1.setUser(user);
        n1.setTitle("Examination Schedule Published");
        n1.setMessage("Mid-Semester Examinations for Semester " + sem + " commence from November 10th.");
        n1.setType(NotificationType.EXAM_RESULT);
        n1.setIsRead(false);
        notificationRepository.save(n1);

        Notification n2 = new Notification();
        n2.setUser(user);
        n2.setTitle("Exam Fee Pending Reminder");
        n2.setMessage("Your Semester Examination Fee of ₹5,000 is due on " + LocalDate.now().plusDays(15) + ". Please pay on time.");
        n2.setType(NotificationType.FEE_REMINDER);
        n2.setIsRead(false);
        notificationRepository.save(n2);
    }

    private void createMark(Student student, Subject subject, double internal, double external, int semester) {
        Mark m = new Mark();
        m.setStudent(student);
        m.setSubject(subject);
        m.setInternalMarks(internal);
        m.setExternalMarks(external);
        m.setSemester(semester);
        m.setAcademicYear("2025-2026");
        m.calculateGradeAndResult();
        markRepository.save(m);
    }
}
