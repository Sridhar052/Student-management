package com.studenthub.dto;

import com.studenthub.enums.FeeType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class FeeCreateDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Fee type is required")
    private FeeType feeType;

    @NotNull(message = "Total amount is required")
    private Double totalAmount;

    private LocalDate dueDate;
    private String academicYear = "2025-2026";

    public FeeCreateDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public FeeType getFeeType() { return feeType; }
    public void setFeeType(FeeType feeType) { this.feeType = feeType; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
