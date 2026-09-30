package com.studenthub.dto;

import com.studenthub.entity.FeePayment;
import com.studenthub.enums.FeeType;
import com.studenthub.enums.PaymentMethod;
import com.studenthub.enums.PaymentStatus;
import java.time.LocalDateTime;

public class FeePaymentDto {
    private Long id;
    private Long studentFeeId;
    private FeeType feeType;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private String transactionId;
    private LocalDateTime paymentDate;
    private Double amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus status;
    private String receiptNumber;
    private String remarks;

    public FeePaymentDto() {}

    public FeePaymentDto(FeePayment fp) {
        this.id = fp.getId();
        if (fp.getStudentFee() != null) {
            this.studentFeeId = fp.getStudentFee().getId();
            this.feeType = fp.getStudentFee().getFeeType();
        }
        if (fp.getStudent() != null) {
            this.studentId = fp.getStudent().getId();
            this.studentName = fp.getStudent().getFullName();
            this.registerNumber = fp.getStudent().getRegisterNumber();
        }
        this.transactionId = fp.getTransactionId();
        this.paymentDate = fp.getPaymentDate();
        this.amount = fp.getAmount();
        this.paymentMethod = fp.getPaymentMethod();
        this.status = fp.getStatus();
        this.receiptNumber = fp.getReceiptNumber();
        this.remarks = fp.getRemarks();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentFeeId() { return studentFeeId; }
    public void setStudentFeeId(Long studentFeeId) { this.studentFeeId = studentFeeId; }
    public FeeType getFeeType() { return feeType; }
    public void setFeeType(FeeType feeType) { this.feeType = feeType; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public PaymentStatus getStatus() { return status; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public String getReceiptNumber() { return receiptNumber; }
    public void setReceiptNumber(String receiptNumber) { this.receiptNumber = receiptNumber; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
