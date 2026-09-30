package com.studenthub.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class MarkInputDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Internal marks are required")
    @Min(value = 0, message = "Internal marks cannot be negative")
    @Max(value = 30, message = "Internal marks cannot exceed 30")
    private Double internalMarks;

    @NotNull(message = "External marks are required")
    @Min(value = 0, message = "External marks cannot be negative")
    @Max(value = 70, message = "External marks cannot exceed 70")
    private Double externalMarks;

    @NotNull(message = "Semester is required")
    private Integer semester;

    private String academicYear = "2025-2026";

    public MarkInputDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public Double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }

    public Double getExternalMarks() { return externalMarks; }
    public void setExternalMarks(Double externalMarks) { this.externalMarks = externalMarks; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
