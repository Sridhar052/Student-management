package com.studenthub.dto;

import java.util.List;
import java.util.Map;

public class AdminDashboardSummaryDto {
    private Long totalStudents;
    private Long activeStudents;
    private Long pendingApplications;
    private Double totalPendingFees;
    private Double totalCollectedFees;
    private Long scholarshipApplicationsCount;
    private Map<String, Long> studentsByDepartment;
    private Map<String, Long> applicationsByStatus;
    private List<ApplicationDto> recentApplications;
    private List<FeePaymentDto> recentPayments;

    public AdminDashboardSummaryDto() {}

    public Long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(Long totalStudents) { this.totalStudents = totalStudents; }

    public Long getActiveStudents() { return activeStudents; }
    public void setActiveStudents(Long activeStudents) { this.activeStudents = activeStudents; }

    public Long getPendingApplications() { return pendingApplications; }
    public void setPendingApplications(Long pendingApplications) { this.pendingApplications = pendingApplications; }

    public Double getTotalPendingFees() { return totalPendingFees; }
    public void setTotalPendingFees(Double totalPendingFees) { this.totalPendingFees = totalPendingFees; }

    public Double getTotalCollectedFees() { return totalCollectedFees; }
    public void setTotalCollectedFees(Double totalCollectedFees) { this.totalCollectedFees = totalCollectedFees; }

    public Long getScholarshipApplicationsCount() { return scholarshipApplicationsCount; }
    public void setScholarshipApplicationsCount(Long scholarshipApplicationsCount) { this.scholarshipApplicationsCount = scholarshipApplicationsCount; }

    public Map<String, Long> getStudentsByDepartment() { return studentsByDepartment; }
    public void setStudentsByDepartment(Map<String, Long> studentsByDepartment) { this.studentsByDepartment = studentsByDepartment; }

    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }

    public List<ApplicationDto> getRecentApplications() { return recentApplications; }
    public void setRecentApplications(List<ApplicationDto> recentApplications) { this.recentApplications = recentApplications; }

    public List<FeePaymentDto> getRecentPayments() { return recentPayments; }
    public void setRecentPayments(List<FeePaymentDto> recentPayments) { this.recentPayments = recentPayments; }
}
