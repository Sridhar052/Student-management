package com.studenthub.service.impl;

import com.studenthub.dto.*;
import com.studenthub.entity.*;
import com.studenthub.enums.ApplicationStatus;
import com.studenthub.enums.FeeStatus;
import com.studenthub.enums.Role;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.*;
import com.studenthub.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StudentFeeRepository studentFeeRepository;

    @Autowired
    private FeePaymentRepository feePaymentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ScholarshipApplicationRepository scholarshipApplicationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public StudentDto getStudentByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
        return new StudentDto(student);
    }

    @Override
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return new StudentDto(student);
    }

    @Override
    @Transactional
    public StudentDto updateStudentProfile(Long userId, StudentUpdateDto dto) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (dto.getPhone() != null) student.setPhone(dto.getPhone());
        if (dto.getEmail() != null) student.setEmail(dto.getEmail());
        if (dto.getAddress() != null) student.setAddress(dto.getAddress());
        if (dto.getCity() != null) student.setCity(dto.getCity());
        if (dto.getDistrict() != null) student.setDistrict(dto.getDistrict());
        if (dto.getState() != null) student.setState(dto.getState());
        if (dto.getPincode() != null) student.setPincode(dto.getPincode());
        if (dto.getParentName() != null) student.setParentName(dto.getParentName());
        if (dto.getParentRelation() != null) student.setParentRelation(dto.getParentRelation());
        if (dto.getParentPhone() != null) student.setParentPhone(dto.getParentPhone());
        if (dto.getParentEmail() != null) student.setParentEmail(dto.getParentEmail());
        if (dto.getProfileImage() != null) student.setProfileImage(dto.getProfileImage());

        Student updated = studentRepository.save(student);
        return new StudentDto(updated);
    }

    @Override
    @Transactional
    public StudentDto adminUpdateStudent(Long id, StudentDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (dto.getFirstName() != null) student.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) student.setLastName(dto.getLastName());
        if (dto.getDepartment() != null) student.setDepartment(dto.getDepartment());
        if (dto.getCourse() != null) student.setCourse(dto.getCourse());
        if (dto.getBatch() != null) student.setBatch(dto.getBatch());
        if (dto.getYear() != null) student.setYear(dto.getYear());
        if (dto.getSemester() != null) student.setSemester(dto.getSemester());
        if (dto.getSection() != null) student.setSection(dto.getSection());
        if (dto.getStatus() != null) student.setStatus(dto.getStatus());
        if (dto.getGender() != null) student.setGender(dto.getGender());
        if (dto.getDob() != null) student.setDob(dto.getDob());
        if (dto.getPhone() != null) student.setPhone(dto.getPhone());
        if (dto.getEmail() != null) student.setEmail(dto.getEmail());
        if (dto.getAttendancePercentage() != null) student.setAttendancePercentage(dto.getAttendancePercentage());

        Student updated = studentRepository.save(student);
        return new StudentDto(updated);
    }

    @Override
    @Transactional
    public StudentDto createStudent(StudentDto dto) {
        User user = new User();
        user.setRegisterNumber(dto.getRegisterNumber());
        user.setEmail(dto.getEmail() != null ? dto.getEmail() : dto.getRegisterNumber() + "@student.edu");
        user.setPassword(passwordEncoder.encode("student123"));
        user.setRole(Role.ROLE_STUDENT);
        user = userRepository.save(user);

        Student student = new Student();
        student.setUser(user);
        student.setRegisterNumber(dto.getRegisterNumber());
        student.setStudentId(dto.getStudentId() != null ? dto.getStudentId() : "STU" + (1000 + new Random().nextInt(9000)));
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setGender(dto.getGender());
        student.setDob(dto.getDob());
        student.setPhone(dto.getPhone());
        student.setEmail(dto.getEmail());
        student.setAddress(dto.getAddress());
        student.setCity(dto.getCity());
        student.setDistrict(dto.getDistrict());
        student.setState(dto.getState());
        student.setPincode(dto.getPincode());
        student.setDepartment(dto.getDepartment());
        student.setCourse(dto.getCourse());
        student.setBatch(dto.getBatch() != null ? dto.getBatch() : "2023-2027");
        student.setYear(dto.getYear() != null ? dto.getYear() : 1);
        student.setSemester(dto.getSemester() != null ? dto.getSemester() : 1);
        student.setSection(dto.getSection() != null ? dto.getSection() : "A");
        student.setAdmissionDate(dto.getAdmissionDate() != null ? dto.getAdmissionDate() : java.time.LocalDate.now());
        student.setParentName(dto.getParentName());
        student.setParentRelation(dto.getParentRelation());
        student.setParentPhone(dto.getParentPhone());
        student.setStatus("ACTIVE");
        student.setGpa(0.0);
        student.setCgpa(0.0);
        student.setAttendancePercentage(92.0);

        Student saved = studentRepository.save(student);
        return new StudentDto(saved);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        student.setStatus("INACTIVE");
        studentRepository.save(student);
    }

    @Override
    public List<StudentDto> getAllStudents(String search, String department, Integer year, String status) {
        String searchParam = (search != null && !search.isBlank()) ? search.trim() : null;
        String deptParam = (department != null && !department.isBlank()) ? department.trim() : null;
        String statusParam = (status != null && !status.isBlank()) ? status.trim() : null;

        List<Student> students = studentRepository.searchStudents(searchParam, deptParam, year, statusParam);
        return students.stream().map(StudentDto::new).collect(Collectors.toList());
    }

    @Override
    public DashboardSummaryDto getStudentDashboardSummary(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        DashboardSummaryDto summary = new DashboardSummaryDto();
        summary.setCurrentSemester(student.getSemester());
        summary.setCgpa(student.getCgpa() != null ? student.getCgpa() : 0.0);
        summary.setAttendancePercentage(student.getAttendancePercentage() != null ? student.getAttendancePercentage() : 0.0);

        // Pending Fees
        List<StudentFee> fees = studentFeeRepository.findByStudentId(student.getId());
        double totalPending = fees.stream().mapToDouble(StudentFee::getPendingAmount).sum();
        summary.setPendingFee(totalPending);

        // Scholarship status
        List<ScholarshipApplication> scholarships = scholarshipApplicationRepository.findByStudentId(student.getId());
        if (!scholarships.isEmpty()) {
            ScholarshipApplication latest = scholarships.get(scholarships.size() - 1);
            summary.setScholarshipStatus(latest.getStatus().name() + " (" + latest.getScholarship().getTitle() + ")");
        } else {
            summary.setScholarshipStatus("NOT_APPLIED");
        }

        // Applications
        List<Application> apps = applicationRepository.findByStudentId(student.getId());
        summary.setTotalApplications(apps.size());
        int pendingApps = (int) apps.stream().filter(a -> a.getStatus() == ApplicationStatus.PENDING || a.getStatus() == ApplicationStatus.UNDER_REVIEW).count();
        summary.setPendingApplications(pendingApps);

        // Recent Notifications
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        summary.setRecentNotifications(notifications.stream().limit(5).map(NotificationDto::new).collect(Collectors.toList()));

        // Recent Transactions
        List<FeePayment> payments = feePaymentRepository.findByStudentIdOrderByPaymentDateDesc(student.getId());
        summary.setRecentTransactions(payments.stream().limit(5).map(FeePaymentDto::new).collect(Collectors.toList()));

        // Recent Applications
        summary.setRecentApplications(apps.stream().limit(5).map(ApplicationDto::new).collect(Collectors.toList()));

        // Semester GPAs
        List<Mark> marks = markRepository.findByStudentId(student.getId());
        Map<Integer, Double> semesterGpaMap = new HashMap<>();
        Map<Integer, List<Mark>> semMarksGroup = marks.stream().collect(Collectors.groupingBy(Mark::getSemester));
        semMarksGroup.forEach((sem, markList) -> {
            double totalGradePoints = 0.0;
            int totalCredits = 0;
            for (Mark m : markList) {
                int credits = m.getSubject() != null && m.getSubject().getCredits() != null ? m.getSubject().getCredits() : 3;
                totalGradePoints += (m.getGradePoint() != null ? m.getGradePoint() : 0.0) * credits;
                totalCredits += credits;
            }
            double semGpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0.0;
            semesterGpaMap.put(sem, Math.round(semGpa * 100.0) / 100.0);
        });
        summary.setSemesterGpas(semesterGpaMap);

        return summary;
    }
}
