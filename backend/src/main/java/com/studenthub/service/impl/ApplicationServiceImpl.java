package com.studenthub.service.impl;

import com.studenthub.dto.ApplicationCreateDto;
import com.studenthub.dto.ApplicationDto;
import com.studenthub.dto.ApplicationStatusUpdateDto;
import com.studenthub.entity.Application;
import com.studenthub.entity.ApplicationStatusHistory;
import com.studenthub.entity.Notification;
import com.studenthub.entity.Student;
import com.studenthub.enums.ApplicationStatus;
import com.studenthub.enums.ApplicationType;
import com.studenthub.enums.NotificationType;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.ApplicationRepository;
import com.studenthub.repository.ApplicationStatusHistoryRepository;
import com.studenthub.repository.NotificationRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ApplicationStatusHistoryRepository historyRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<ApplicationDto> getStudentApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId)
                .stream().map(ApplicationDto::new).collect(Collectors.toList());
    }

    @Override
    public List<ApplicationDto> getStudentApplicationsByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return getStudentApplications(student.getId());
    }

    @Override
    @Transactional
    public ApplicationDto createApplication(Long userId, ApplicationCreateDto dto) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Application app = new Application();
        app.setStudent(student);
        app.setApplicationType(dto.getApplicationType());
        app.setTitle(dto.getTitle());
        app.setDescription(dto.getDescription());
        app.setStatus(ApplicationStatus.PENDING);
        app.setAdminRemarks("Application submitted successfully. Under initial review.");

        Application saved = applicationRepository.save(app);

        // Record initial history
        ApplicationStatusHistory history = new ApplicationStatusHistory(saved, ApplicationStatus.PENDING, "Application Submitted", student.getFullName());
        historyRepository.save(history);

        // Send notification
        Notification notification = new Notification();
        notification.setUser(student.getUser());
        notification.setTitle("Application Submitted: " + dto.getTitle());
        notification.setMessage("Your request for " + dto.getApplicationType() + " has been logged and is pending review.");
        notification.setType(NotificationType.APPLICATION_UPDATE);
        notificationRepository.save(notification);

        return new ApplicationDto(saved);
    }

    @Override
    public ApplicationDto getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
        return new ApplicationDto(app);
    }

    @Override
    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatusUpdateDto dto, String updatedBy) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        app.setStatus(dto.getStatus());
        if (dto.getRemarks() != null && !dto.getRemarks().isBlank()) {
            app.setAdminRemarks(dto.getRemarks());
        }
        Application updated = applicationRepository.save(app);

        // Record history
        ApplicationStatusHistory history = new ApplicationStatusHistory(updated, dto.getStatus(), dto.getRemarks(), updatedBy);
        historyRepository.save(history);

        // Notify Student
        Notification notification = new Notification();
        notification.setUser(app.getStudent().getUser());
        notification.setTitle("Application " + dto.getStatus().name() + ": " + app.getTitle());
        notification.setMessage("Status updated to " + dto.getStatus() + ". Remarks: " + (dto.getRemarks() != null ? dto.getRemarks() : "No remarks provided."));
        notification.setType(NotificationType.APPLICATION_UPDATE);
        notificationRepository.save(notification);

        return new ApplicationDto(updated);
    }

    @Override
    public List<ApplicationDto> getAllApplications(ApplicationType type, ApplicationStatus status, String department) {
        List<Application> apps = applicationRepository.findAll();
        return apps.stream()
                .filter(a -> type == null || a.getApplicationType() == type)
                .filter(a -> status == null || a.getStatus() == status)
                .filter(a -> department == null || (a.getStudent() != null && department.equalsIgnoreCase(a.getStudent().getDepartment())))
                .map(ApplicationDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getApplicationDetailsWithHistory(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));

        List<ApplicationStatusHistory> history = historyRepository.findByApplicationIdOrderByUpdatedAtDesc(id);

        Map<String, Object> details = new HashMap<>();
        details.put("application", new ApplicationDto(app));
        details.put("history", history.stream().map(h -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", h.getId());
            map.put("status", h.getStatus());
            map.put("remarks", h.getRemarks());
            map.put("updatedBy", h.getUpdatedBy());
            map.put("updatedAt", h.getUpdatedAt());
            return map;
        }).collect(Collectors.toList()));

        return details;
    }
}
