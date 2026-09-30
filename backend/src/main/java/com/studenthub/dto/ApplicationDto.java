package com.studenthub.dto;

import com.studenthub.entity.Application;
import com.studenthub.enums.ApplicationStatus;
import com.studenthub.enums.ApplicationType;
import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private String department;
    private ApplicationType applicationType;
    private String title;
    private String description;
    private ApplicationStatus status;
    private String adminRemarks;
    private LocalDateTime submittedDate;
    private LocalDateTime updatedDate;

    public ApplicationDto() {}

    public ApplicationDto(Application app) {
        this.id = app.getId();
        if (app.getStudent() != null) {
            this.studentId = app.getStudent().getId();
            this.studentName = app.getStudent().getFullName();
            this.registerNumber = app.getStudent().getRegisterNumber();
            this.department = app.getStudent().getDepartment();
        }
        this.applicationType = app.getApplicationType();
        this.title = app.getTitle();
        this.description = app.getDescription();
        this.status = app.getStatus();
        this.adminRemarks = app.getAdminRemarks();
        this.submittedDate = app.getSubmittedDate();
        this.updatedDate = app.getUpdatedDate();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public ApplicationType getApplicationType() { return applicationType; }
    public void setApplicationType(ApplicationType applicationType) { this.applicationType = applicationType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }

    public LocalDateTime getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(LocalDateTime submittedDate) { this.submittedDate = submittedDate; }

    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}
