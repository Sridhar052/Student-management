package com.studenthub.controller;

import com.studenthub.dto.ApiResponse;
import com.studenthub.dto.ApplicationCreateDto;
import com.studenthub.dto.ApplicationDto;
import com.studenthub.dto.ApplicationStatusUpdateDto;
import com.studenthub.enums.ApplicationStatus;
import com.studenthub.enums.ApplicationType;
import com.studenthub.security.UserPrincipal;
import com.studenthub.service.ApplicationService;
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
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/students/me/applications")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getMyApplications(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<ApplicationDto> apps = applicationService.getStudentApplicationsByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", apps));
    }

    @PostMapping("/students/me/applications")
    public ResponseEntity<ApiResponse<ApplicationDto>> createApplication(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                         @Valid @RequestBody ApplicationCreateDto createDto) {
        ApplicationDto created = applicationService.createApplication(currentUser.getId(), createDto);
        return ResponseEntity.ok(ApiResponse.success("Application submitted successfully", created));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getApplicationDetails(@PathVariable Long id) {
        Map<String, Object> details = applicationService.getApplicationDetailsWithHistory(id);
        return ResponseEntity.ok(ApiResponse.success("Application details retrieved", details));
    }

    @GetMapping("/admin/applications")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getAllApplications(
            @RequestParam(required = false) ApplicationType type,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String department) {
        List<ApplicationDto> apps = applicationService.getAllApplications(type, status, department);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved successfully", apps));
    }

    @PutMapping("/admin/applications/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateDto updateDto,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        ApplicationDto updated = applicationService.updateApplicationStatus(id, updateDto, currentUser.getEmail());
        return ResponseEntity.ok(ApiResponse.success("Application status updated successfully", updated));
    }
}
