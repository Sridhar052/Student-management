package com.studenthub.controller;

import com.studenthub.dto.ApiResponse;
import com.studenthub.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/reports")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class ReportController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateReport(
            @RequestParam(defaultValue = "STUDENT") String type,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status) {
        Map<String, Object> report = adminDashboardService.generateReport(type, department, status);
        return ResponseEntity.ok(ApiResponse.success("Report generated successfully", report));
    }
}
