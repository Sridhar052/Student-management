package com.studenthub.dto;

import com.studenthub.entity.StudentFee;
import com.studenthub.enums.FeeStatus;
import com.studenthub.enums.FeeType;
import java.time.LocalDate;

public class StudentFeeDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private FeeType feeType;
    private Double totalAmount;
    private Double paidAmount;
    private Double pendingAmount;
    private LocalDate dueDate;
    private String academicYear;
    private FeeStatus status;

    public StudentFeeDto() {}

    public StudentFeeDto(StudentFee sf) {
        this.id = sf.getId();
        if (sf.getStudent() != null) {
            this.studentId = sf.getStudent().getId();
            this.studentName = sf.getStudent().getFullName();
            this.registerNumber = sf.getStudent().getRegisterNumber();
        }
        this.feeType = sf.getFeeType();
        this.totalAmount = sf.getTotalAmount();
        this.paidAmount = sf.getPaidAmount();
        this.pendingAmount = sf.getPendingAmount();
        this.dueDate = sf.getDueDate();
        this.academicYear = sf.getAcademicYear();
        this.status = sf.getStatus();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public FeeType getFeeType() { return feeType; }
    public void setFeeType(FeeType feeType) { this.feeType = feeType; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Double getPaidAmount() { return paidAmount; }
    public void setPaidAmount(Double paidAmount) { this.paidAmount = paidAmount; }
    public Double getPendingAmount() { return pendingAmount; }
    public void setPendingAmount(Double pendingAmount) { this.pendingAmount = pendingAmount; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public FeeStatus getStatus() { return status; }
    public void setStatus(FeeStatus status) { this.status = status; }
}
