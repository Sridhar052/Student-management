package com.studenthub.service.impl;

import com.studenthub.dto.ScholarshipApplicationDto;
import com.studenthub.dto.ScholarshipDto;
import com.studenthub.entity.Notification;
import com.studenthub.entity.Scholarship;
import com.studenthub.entity.ScholarshipApplication;
import com.studenthub.entity.Student;
import com.studenthub.enums.NotificationType;
import com.studenthub.enums.ScholarshipStatus;
import com.studenthub.exception.BadRequestException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.NotificationRepository;
import com.studenthub.repository.ScholarshipApplicationRepository;
import com.studenthub.repository.ScholarshipRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.service.ScholarshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScholarshipServiceImpl implements ScholarshipService {

    @Autowired
    private ScholarshipRepository scholarshipRepository;

    @Autowired
    private ScholarshipApplicationRepository scholarshipApplicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<ScholarshipDto> getAllScholarships() {
        return scholarshipRepository.findAll().stream().map(ScholarshipDto::new).collect(Collectors.toList());
    }

    @Override
    public ScholarshipDto getScholarshipById(Long id) {
        Scholarship scholarship = scholarshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with ID: " + id));
        return new ScholarshipDto(scholarship);
    }

    @Override
    @Transactional
    public ScholarshipDto createScholarship(ScholarshipDto dto) {
        Scholarship scholarship = new Scholarship();
        scholarship.setTitle(dto.getTitle());
        scholarship.setDescription(dto.getDescription());
        scholarship.setProvider(dto.getProvider());
        scholarship.setAmount(dto.getAmount());
        scholarship.setEligibilityCriteria(dto.getEligibilityCriteria());
        scholarship.setAcademicYear(dto.getAcademicYear() != null ? dto.getAcademicYear() : "2025-2026");
        scholarship.setStatus("ACTIVE");
        Scholarship saved = scholarshipRepository.save(scholarship);
        return new ScholarshipDto(saved);
    }

    @Override
    @Transactional
    public ScholarshipApplicationDto applyForScholarship(Long userId, Long scholarshipId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Scholarship scholarship = scholarshipRepository.findById(scholarshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship not found with ID: " + scholarshipId));

        Optional<ScholarshipApplication> existing = scholarshipApplicationRepository.findByScholarshipIdAndStudentId(scholarshipId, student.getId());
        if (existing.isPresent()) {
            throw new BadRequestException("You have already applied for this scholarship!");
        }

        ScholarshipApplication app = new ScholarshipApplication();
        app.setScholarship(scholarship);
        app.setStudent(student);
        app.setStatus(ScholarshipStatus.APPLIED);
        app.setRemarks("Application submitted successfully.");
        app.setDisbursementStatus("PENDING");

        ScholarshipApplication saved = scholarshipApplicationRepository.save(app);

        // Notify
        Notification notification = new Notification();
        notification.setUser(student.getUser());
        notification.setTitle("Scholarship Application Submitted: " + scholarship.getTitle());
        notification.setMessage("Your application for " + scholarship.getTitle() + " (Amount: ₹" + scholarship.getAmount() + ") has been submitted.");
        notification.setType(NotificationType.SCHOLARSHIP_UPDATE);
        notificationRepository.save(notification);

        return new ScholarshipApplicationDto(saved);
    }

    @Override
    public List<ScholarshipApplicationDto> getStudentScholarshipApplications(Long studentId) {
        return scholarshipApplicationRepository.findByStudentId(studentId)
                .stream().map(ScholarshipApplicationDto::new).collect(Collectors.toList());
    }

    @Override
    public List<ScholarshipApplicationDto> getStudentScholarshipApplicationsByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return getStudentScholarshipApplications(student.getId());
    }

    @Override
    public List<ScholarshipApplicationDto> getAllScholarshipApplications(ScholarshipStatus status) {
        List<ScholarshipApplication> apps = (status != null) ?
                scholarshipApplicationRepository.findByStatus(status) : scholarshipApplicationRepository.findAll();
        return apps.stream().map(ScholarshipApplicationDto::new).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ScholarshipApplicationDto updateScholarshipApplicationStatus(Long applicationId, ScholarshipStatus status, String remarks, Double approvedAmount, String disbursementStatus) {
        ScholarshipApplication app = scholarshipApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Scholarship application not found with ID: " + applicationId));

        app.setStatus(status);
        if (remarks != null && !remarks.isBlank()) app.setRemarks(remarks);
        if (approvedAmount != null) app.setApprovedAmount(approvedAmount);
        if (disbursementStatus != null) app.setDisbursementStatus(disbursementStatus);
        if (status == ScholarshipStatus.APPROVED || status == ScholarshipStatus.DISBURSED) {
            app.setApprovedDate(LocalDateTime.now());
        }

        ScholarshipApplication updated = scholarshipApplicationRepository.save(app);

        // Notify Student
        Notification notification = new Notification();
        notification.setUser(app.getStudent().getUser());
        notification.setTitle("Scholarship Update: " + app.getScholarship().getTitle());
        notification.setMessage("Your scholarship application status is now " + status + ". Disbursement: " + app.getDisbursementStatus());
        notification.setType(NotificationType.SCHOLARSHIP_UPDATE);
        notificationRepository.save(notification);

        return new ScholarshipApplicationDto(updated);
    }
}
