package com.studenthub.service.impl;

import com.studenthub.dto.AdminDashboardSummaryDto;
import com.studenthub.dto.ApplicationDto;
import com.studenthub.dto.FeePaymentDto;
import com.studenthub.entity.Application;
import com.studenthub.entity.FeePayment;
import com.studenthub.entity.Student;
import com.studenthub.entity.StudentFee;
import com.studenthub.enums.ApplicationStatus;
import com.studenthub.enums.FeeStatus;
import com.studenthub.repository.*;
import com.studenthub.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentFeeRepository studentFeeRepository;

    @Autowired
    private FeePaymentRepository feePaymentRepository;

    @Autowired
    private ScholarshipApplicationRepository scholarshipApplicationRepository;

    @Override
    public AdminDashboardSummaryDto getAdminDashboardSummary() {
        AdminDashboardSummaryDto dto = new AdminDashboardSummaryDto();

        List<Student> students = studentRepository.findAll();
        dto.setTotalStudents((long) students.size());
        dto.setActiveStudents(students.stream().filter(s -> "ACTIVE".equalsIgnoreCase(s.getStatus())).count());

        List<Application> apps = applicationRepository.findAll();
        dto.setPendingApplications(apps.stream().filter(a -> a.getStatus() == ApplicationStatus.PENDING || a.getStatus() == ApplicationStatus.UNDER_REVIEW).count());

        List<StudentFee> fees = studentFeeRepository.findAll();
        double pendingSum = fees.stream().mapToDouble(StudentFee::getPendingAmount).sum();
        double collectedSum = fees.stream().mapToDouble(StudentFee::getPaidAmount).sum();
        dto.setTotalPendingFees(pendingSum);
        dto.setTotalCollectedFees(collectedSum);

        dto.setScholarshipApplicationsCount((long) scholarshipApplicationRepository.findAll().size());

        // Students by department
        Map<String, Long> byDept = students.stream()
                .filter(s -> s.getDepartment() != null)
                .collect(Collectors.groupingBy(Student::getDepartment, Collectors.counting()));
        dto.setStudentsByDepartment(byDept);

        // Applications by status
        Map<String, Long> byStatus = apps.stream()
                .collect(Collectors.groupingBy(a -> a.getStatus().name(), Collectors.counting()));
        dto.setApplicationsByStatus(byStatus);

        // Recent applications
        dto.setRecentApplications(apps.stream().limit(5).map(ApplicationDto::new).collect(Collectors.toList()));

        // Recent payments
        List<FeePayment> payments = feePaymentRepository.findAll();
        payments.sort((a, b) -> b.getPaymentDate().compareTo(a.getPaymentDate()));
        dto.setRecentPayments(payments.stream().limit(5).map(FeePaymentDto::new).collect(Collectors.toList()));

        return dto;
    }

    @Override
    public Map<String, Object> generateReport(String reportType, String department, String status) {
        Map<String, Object> report = new HashMap<>();
        report.put("reportType", reportType);
        report.put("generatedAt", java.time.LocalDateTime.now());
        report.put("department", department != null ? department : "ALL");

        if ("STUDENT".equalsIgnoreCase(reportType)) {
            List<Student> list = studentRepository.findAll();
            if (department != null && !department.isBlank()) {
                list = list.stream().filter(s -> department.equalsIgnoreCase(s.getDepartment())).collect(Collectors.toList());
            }
            report.put("count", list.size());
            report.put("data", list);
        } else if ("FEE_COLLECTION".equalsIgnoreCase(reportType) || "PENDING_FEE".equalsIgnoreCase(reportType)) {
            List<StudentFee> fees = studentFeeRepository.findAll();
            if ("PENDING_FEE".equalsIgnoreCase(reportType)) {
                fees = fees.stream().filter(f -> f.getStatus() != FeeStatus.PAID).collect(Collectors.toList());
            }
            report.put("count", fees.size());
            report.put("totalAmount", fees.stream().mapToDouble(StudentFee::getTotalAmount).sum());
            report.put("paidAmount", fees.stream().mapToDouble(StudentFee::getPaidAmount).sum());
            report.put("pendingAmount", fees.stream().mapToDouble(StudentFee::getPendingAmount).sum());
            report.put("data", fees);
        } else if ("APPLICATION".equalsIgnoreCase(reportType)) {
            List<Application> apps = applicationRepository.findAll();
            report.put("count", apps.size());
            report.put("data", apps.stream().map(ApplicationDto::new).collect(Collectors.toList()));
        } else {
            report.put("summary", getAdminDashboardSummary());
        }

        return report;
    }
}
