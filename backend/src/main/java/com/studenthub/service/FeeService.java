package com.studenthub.service;

import com.studenthub.dto.FeeCreateDto;
import com.studenthub.dto.FeePaymentDto;
import com.studenthub.dto.FeePaymentRequestDto;
import com.studenthub.dto.StudentFeeDto;
import com.studenthub.enums.FeeStatus;

import java.util.List;
import java.util.Map;

public interface FeeService {
    List<StudentFeeDto> getStudentFees(Long studentId);
    List<StudentFeeDto> getStudentFeesByUserId(Long userId);
    Map<String, Object> getStudentFeeSummary(Long studentId);
    Map<String, Object> getStudentFeeSummaryByUserId(Long userId);
    List<FeePaymentDto> getStudentPaymentHistory(Long studentId);
    List<FeePaymentDto> getStudentPaymentHistoryByUserId(Long userId);
    FeePaymentDto payFee(Long userId, FeePaymentRequestDto requestDto);
    StudentFeeDto createStudentFee(FeeCreateDto createDto);
    List<StudentFeeDto> getAllStudentFees(FeeStatus status);
    FeePaymentDto getReceiptByTransactionId(String transactionId);
}
