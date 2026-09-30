package com.studenthub.service.impl;

import com.studenthub.dto.FeeCreateDto;
import com.studenthub.dto.FeePaymentDto;
import com.studenthub.dto.FeePaymentRequestDto;
import com.studenthub.dto.StudentFeeDto;
import com.studenthub.entity.FeePayment;
import com.studenthub.entity.Notification;
import com.studenthub.entity.Student;
import com.studenthub.entity.StudentFee;
import com.studenthub.enums.FeeStatus;
import com.studenthub.enums.NotificationType;
import com.studenthub.enums.PaymentStatus;
import com.studenthub.exception.BadRequestException;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.FeePaymentRepository;
import com.studenthub.repository.NotificationRepository;
import com.studenthub.repository.StudentFeeRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.service.FeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FeeServiceImpl implements FeeService {

    @Autowired
    private StudentFeeRepository studentFeeRepository;

    @Autowired
    private FeePaymentRepository feePaymentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public List<StudentFeeDto> getStudentFees(Long studentId) {
        return studentFeeRepository.findByStudentId(studentId)
                .stream().map(StudentFeeDto::new).collect(Collectors.toList());
    }

    @Override
    public List<StudentFeeDto> getStudentFeesByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return getStudentFees(student.getId());
    }

    @Override
    public Map<String, Object> getStudentFeeSummary(Long studentId) {
        List<StudentFee> fees = studentFeeRepository.findByStudentId(studentId);

        double totalFee = fees.stream().mapToDouble(StudentFee::getTotalAmount).sum();
        double paidFee = fees.stream().mapToDouble(StudentFee::getPaidAmount).sum();
        double pendingFee = fees.stream().mapToDouble(StudentFee::getPendingAmount).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalFee", totalFee);
        summary.put("paidFee", paidFee);
        summary.put("pendingFee", pendingFee);
        summary.put("feesBreakdown", fees.stream().map(StudentFeeDto::new).collect(Collectors.toList()));

        return summary;
    }

    @Override
    public Map<String, Object> getStudentFeeSummaryByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return getStudentFeeSummary(student.getId());
    }

    @Override
    public List<FeePaymentDto> getStudentPaymentHistory(Long studentId) {
        return feePaymentRepository.findByStudentIdOrderByPaymentDateDesc(studentId)
                .stream().map(FeePaymentDto::new).collect(Collectors.toList());
    }

    @Override
    public List<FeePaymentDto> getStudentPaymentHistoryByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return getStudentPaymentHistory(student.getId());
    }

    @Override
    @Transactional
    public FeePaymentDto payFee(Long userId, FeePaymentRequestDto req) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        StudentFee fee = studentFeeRepository.findById(req.getStudentFeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Student fee record not found with ID: " + req.getStudentFeeId()));

        if (!fee.getStudent().getId().equals(student.getId())) {
            throw new BadRequestException("Unauthorized fee payment attempt!");
        }

        if (fee.getPendingAmount() <= 0) {
            throw new BadRequestException("This fee component has already been fully paid!");
        }

        if (req.getAmount() > fee.getPendingAmount()) {
            throw new BadRequestException("Payment amount (₹" + req.getAmount() + ") cannot exceed pending amount (₹" + fee.getPendingAmount() + ")!");
        }

        // Generate Transaction ID and Receipt Number
        String txId = "TXN" + System.currentTimeMillis() + (100 + new Random().nextInt(900));
        String receiptNo = "RCPT-" + LocalDate.now().getYear() + "-" + (10000 + new Random().nextInt(90000));

        FeePayment payment = new FeePayment();
        payment.setStudentFee(fee);
        payment.setStudent(student);
        payment.setTransactionId(txId);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setAmount(req.getAmount());
        payment.setPaymentMethod(req.getPaymentMethod());
        payment.setStatus(PaymentStatus.PAID);
        payment.setReceiptNumber(receiptNo);
        payment.setRemarks(req.getRemarks() != null ? req.getRemarks() : "Payment processed via " + req.getPaymentMethod());

        FeePayment savedPayment = feePaymentRepository.save(payment);

        // Update fee paid & pending amounts
        fee.setPaidAmount(fee.getPaidAmount() + req.getAmount());
        fee.recalculatePending();
        studentFeeRepository.save(fee);

        // Send notification to student
        Notification notification = new Notification();
        notification.setUser(student.getUser());
        notification.setTitle("Fee Payment Successful - Receipt #" + receiptNo);
        notification.setMessage("Payment of ₹" + req.getAmount() + " for " + fee.getFeeType() + " fee has been recorded successfully. Txn ID: " + txId);
        notification.setType(NotificationType.FEE_REMINDER);
        notificationRepository.save(notification);

        return new FeePaymentDto(savedPayment);
    }

    @Override
    @Transactional
    public StudentFeeDto createStudentFee(FeeCreateDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudentId()));

        StudentFee fee = new StudentFee();
        fee.setStudent(student);
        fee.setFeeType(dto.getFeeType());
        fee.setTotalAmount(dto.getTotalAmount());
        fee.setPaidAmount(0.0);
        fee.setDueDate(dto.getDueDate() != null ? dto.getDueDate() : java.time.LocalDate.now().plusDays(30));
        fee.setAcademicYear(dto.getAcademicYear() != null ? dto.getAcademicYear() : "2025-2026");
        fee.setStatus(FeeStatus.PENDING);
        fee.recalculatePending();

        StudentFee saved = studentFeeRepository.save(fee);
        return new StudentFeeDto(saved);
    }

    @Override
    public List<StudentFeeDto> getAllStudentFees(FeeStatus status) {
        List<StudentFee> fees = (status != null) ? studentFeeRepository.findByStatus(status) : studentFeeRepository.findAll();
        return fees.stream().map(StudentFeeDto::new).collect(Collectors.toList());
    }

    @Override
    public FeePaymentDto getReceiptByTransactionId(String transactionId) {
        FeePayment payment = feePaymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment receipt not found for transaction: " + transactionId));
        return new FeePaymentDto(payment);
    }
}
