package com.studenthub.service;

import com.studenthub.dto.AdminDashboardSummaryDto;
import java.util.Map;

public interface AdminDashboardService {
    AdminDashboardSummaryDto getAdminDashboardSummary();
    Map<String, Object> generateReport(String reportType, String department, String status);
}
