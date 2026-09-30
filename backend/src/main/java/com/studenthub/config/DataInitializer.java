package com.studenthub.config;

import com.studenthub.entity.*;
import com.studenthub.enums.*;
import com.studenthub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already initialized.");
            return;
        }

        System.out.println("Initializing Fresh StudentHub Admin & Subject Master Data...");

        // 1. Create System Admin User
        User adminUser = new User();
        adminUser.setEmail("admin@studenthub.com");
        adminUser.setRegisterNumber("ADMIN001");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setRole(Role.ROLE_ADMIN);
        userRepository.save(adminUser);

        // 2. Create Master Course Subjects
        subjectRepository.save(new Subject(null, "CS101", "Data Structures & Algorithms", 4, 1, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS102", "Object Oriented Programming", 3, 1, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS103", "Mathematics I", 4, 1, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS201", "Database Management Systems", 4, 2, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS202", "Operating Systems", 4, 2, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS301", "Computer Networks", 3, 3, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS302", "Software Engineering", 3, 3, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS401", "Web Development & Cloud", 4, 4, "Computer Science"));
        subjectRepository.save(new Subject(null, "CS402", "Artificial Intelligence & ML", 4, 4, "Computer Science"));

        // 3. Create Scholarship Schemes
        Scholarship sch1 = new Scholarship();
        sch1.setTitle("National Merit Tech Scholarship 2026");
        sch1.setDescription("Merit-based financial aid for engineering students with CGPA >= 8.5.");
        sch1.setProvider("Ministry of Education");
        sch1.setAmount(50000.0);
        sch1.setEligibilityCriteria("Minimum 85% in previous semesters, Family annual income < ₹8,00,000");
        sch1.setAcademicYear("2025-2026");
        sch1.setStatus("ACTIVE");
        scholarshipRepository.save(sch1);

        Scholarship sch2 = new Scholarship();
        sch2.setTitle("Women in Tech Excellence Award");
        sch2.setDescription("Scholarship supporting female undergraduate STEM scholars.");
        sch2.setProvider("Global Tech Foundation");
        sch2.setAmount(75000.0);
        sch2.setEligibilityCriteria("Female student enrolled in CS/IT/EC, CGPA >= 8.0");
        sch2.setAcademicYear("2025-2026");
        sch2.setStatus("ACTIVE");
        scholarshipRepository.save(sch2);

        System.out.println("Fresh StudentHub Admin Account Initialized Successfully!");
    }
}
