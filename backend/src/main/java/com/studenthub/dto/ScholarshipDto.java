package com.studenthub.dto;

import com.studenthub.entity.Scholarship;
import com.studenthub.entity.ScholarshipApplication;
import com.studenthub.enums.ScholarshipStatus;
import java.time.LocalDateTime;

public class ScholarshipDto {
    private Long id;
    private String title;
    private String description;
    private String provider;
    private Double amount;
    private String eligibilityCriteria;
    private String academicYear;
    private String status;

    public ScholarshipDto() {}

    public ScholarshipDto(Scholarship s) {
        this.id = s.getId();
        this.title = s.getTitle();
        this.description = s.getDescription();
        this.provider = s.getProvider();
        this.amount = s.getAmount();
        this.eligibilityCriteria = s.getEligibilityCriteria();
        this.academicYear = s.getAcademicYear();
        this.status = s.getStatus();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
