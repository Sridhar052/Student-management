package com.studenthub.dto;

import com.studenthub.enums.PaymentMethod;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class FeePaymentRequestDto {

    @NotNull(message = "Student Fee ID is required")
    private Long studentFeeId;

    @NotNull(message = "Payment amount is required")
    @Min(value = 1, message = "Amount must be at least ₹1")
    private Double amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String remarks;

    public FeePaymentRequestDto() {}

    public Long getStudentFeeId() { return studentFeeId; }
    public void setStudentFeeId(Long studentFeeId) { this.studentFeeId = studentFeeId; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
