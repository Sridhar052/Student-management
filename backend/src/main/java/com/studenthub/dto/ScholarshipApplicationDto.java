package com.studenthub.dto;

import com.studenthub.entity.ScholarshipApplication;
import com.studenthub.enums.ScholarshipStatus;
import java.time.LocalDateTime;

public class ScholarshipApplicationDto {
    private Long id;
    private Long scholarshipId;
    private String scholarshipTitle;
    private String provider;
    private Double scholarshipAmount;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private LocalDateTime applicationDate;
    private ScholarshipStatus status;
    private String remarks;
    private Double approvedAmount;
    private String disbursementStatus;
    private LocalDateTime approvedDate;

    public ScholarshipApplicationDto() {}

    public ScholarshipApplicationDto(ScholarshipApplication sa) {
        this.id = sa.getId();
        if (sa.getScholarship() != null) {
            this.scholarshipId = sa.getScholarship().getId();
            this.scholarshipTitle = sa.getScholarship().getTitle();
            this.provider = sa.getScholarship().getProvider();
            this.scholarshipAmount = sa.getScholarship().getAmount();
        }
        if (sa.getStudent() != null) {
            this.studentId = sa.getStudent().getId();
            this.studentName = sa.getStudent().getFullName();
            this.registerNumber = sa.getStudent().getRegisterNumber();
        }
        this.applicationDate = sa.getApplicationDate();
        this.status = sa.getStatus();
        this.remarks = sa.getRemarks();
        this.approvedAmount = sa.getApprovedAmount();
        this.disbursementStatus = sa.getDisbursementStatus();
        this.approvedDate = sa.getApprovedDate();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getScholarshipId() { return scholarshipId; }
    public void setScholarshipId(Long scholarshipId) { this.scholarshipId = scholarshipId; }
    public String getScholarshipTitle() { return scholarshipTitle; }
    public void setScholarshipTitle(String scholarshipTitle) { this.scholarshipTitle = scholarshipTitle; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public Double getScholarshipAmount() { return scholarshipAmount; }
    public void setScholarshipAmount(Double scholarshipAmount) { this.scholarshipAmount = scholarshipAmount; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public LocalDateTime getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDateTime applicationDate) { this.applicationDate = applicationDate; }
    public ScholarshipStatus getStatus() { return status; }
    public void setStatus(ScholarshipStatus status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public Double getApprovedAmount() { return approvedAmount; }
    public void setApprovedAmount(Double approvedAmount) { this.approvedAmount = approvedAmount; }
    public String getDisbursementStatus() { return disbursementStatus; }
    public void setDisbursementStatus(String disbursementStatus) { this.disbursementStatus = disbursementStatus; }
    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }
}
