package com.studenthub.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    private Integer currentSemester;
    private Double cgpa;
    private Double attendancePercentage;
    private Double pendingFee;
    private String scholarshipStatus;
    private Integer totalApplications;
    private Integer pendingApplications;
    private List<NotificationDto> recentNotifications;
    private List<FeePaymentDto> recentTransactions;
    private List<ApplicationDto> recentApplications;
    private Map<Integer, Double> semesterGpas;

    public DashboardSummaryDto() {}

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public Double getPendingFee() { return pendingFee; }
    public void setPendingFee(Double pendingFee) { this.pendingFee = pendingFee; }

    public String getScholarshipStatus() { return scholarshipStatus; }
    public void setScholarshipStatus(String scholarshipStatus) { this.scholarshipStatus = scholarshipStatus; }

    public Integer getTotalApplications() { return totalApplications; }
    public void setTotalApplications(Integer totalApplications) { this.totalApplications = totalApplications; }

    public Integer getPendingApplications() { return pendingApplications; }
    public void setPendingApplications(Integer pendingApplications) { this.pendingApplications = pendingApplications; }

    public List<NotificationDto> getRecentNotifications() { return recentNotifications; }
    public void setRecentNotifications(List<NotificationDto> recentNotifications) { this.recentNotifications = recentNotifications; }

    public List<FeePaymentDto> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<FeePaymentDto> recentTransactions) { this.recentTransactions = recentTransactions; }

    public List<ApplicationDto> getRecentApplications() { return recentApplications; }
    public void setRecentApplications(List<ApplicationDto> recentApplications) { this.recentApplications = recentApplications; }

    public Map<Integer, Double> getSemesterGpas() { return semesterGpas; }
    public void setSemesterGpas(Map<Integer, Double> semesterGpas) { this.semesterGpas = semesterGpas; }
}
