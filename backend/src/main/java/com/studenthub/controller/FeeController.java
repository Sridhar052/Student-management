package com.studenthub.controller;

import com.studenthub.dto.*;
import com.studenthub.enums.FeeStatus;
import com.studenthub.security.UserPrincipal;
import com.studenthub.service.FeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class FeeController {

    @Autowired
    private FeeService feeService;

    @GetMapping("/students/me/fees")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyFees(@AuthenticationPrincipal UserPrincipal currentUser) {
        Map<String, Object> summary = feeService.getStudentFeeSummaryByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Fee summary retrieved successfully", summary));
    }

    @GetMapping("/students/me/payments")
    public ResponseEntity<ApiResponse<List<FeePaymentDto>>> getMyPaymentHistory(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<FeePaymentDto> payments = feeService.getStudentPaymentHistoryByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment history retrieved successfully", payments));
    }

    @PostMapping("/students/me/payments/pay")
    public ResponseEntity<ApiResponse<FeePaymentDto>> payFee(@AuthenticationPrincipal UserPrincipal currentUser,
                                                             @Valid @RequestBody FeePaymentRequestDto requestDto) {
        FeePaymentDto payment = feeService.payFee(currentUser.getId(), requestDto);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", payment));
    }

    @GetMapping("/payments/receipt/{transactionId}")
    public ResponseEntity<ApiResponse<FeePaymentDto>> getReceipt(@PathVariable String transactionId) {
        FeePaymentDto receipt = feeService.getReceiptByTransactionId(transactionId);
        return ResponseEntity.ok(ApiResponse.success("Receipt retrieved successfully", receipt));
    }

    @GetMapping("/admin/fees")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<StudentFeeDto>>> getAllStudentFees(@RequestParam(required = false) FeeStatus status) {
        List<StudentFeeDto> fees = feeService.getAllStudentFees(status);
        return ResponseEntity.ok(ApiResponse.success("Student fees retrieved successfully", fees));
    }

    @PostMapping("/admin/fees")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<StudentFeeDto>> createStudentFee(@Valid @RequestBody FeeCreateDto createDto) {
        StudentFeeDto fee = feeService.createStudentFee(createDto);
        return ResponseEntity.ok(ApiResponse.success("Student fee created successfully", fee));
    }
}
