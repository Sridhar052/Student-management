package com.studenthub.controller;

import com.studenthub.dto.ApiResponse;
import com.studenthub.dto.ScholarshipApplicationDto;
import com.studenthub.dto.ScholarshipDto;
import com.studenthub.enums.ScholarshipStatus;
import com.studenthub.security.UserPrincipal;
import com.studenthub.service.ScholarshipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ScholarshipController {

    @Autowired
    private ScholarshipService scholarshipService;

    @GetMapping("/scholarships")
    public ResponseEntity<ApiResponse<List<ScholarshipDto>>> getAllScholarships() {
        List<ScholarshipDto> scholarships = scholarshipService.getAllScholarships();
        return ResponseEntity.ok(ApiResponse.success("Scholarships retrieved successfully", scholarships));
    }

    @GetMapping("/scholarships/{id}")
    public ResponseEntity<ApiResponse<ScholarshipDto>> getScholarshipById(@PathVariable Long id) {
        ScholarshipDto dto = scholarshipService.getScholarshipById(id);
        return ResponseEntity.ok(ApiResponse.success("Scholarship details retrieved", dto));
    }

    @GetMapping("/students/me/scholarships")
    public ResponseEntity<ApiResponse<List<ScholarshipApplicationDto>>> getMyScholarshipApplications(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<ScholarshipApplicationDto> apps = scholarshipService.getStudentScholarshipApplicationsByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Your scholarship applications retrieved", apps));
    }

    @PostMapping("/students/me/scholarships/{scholarshipId}/apply")
    public ResponseEntity<ApiResponse<ScholarshipApplicationDto>> applyForScholarship(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                                      @PathVariable Long scholarshipId) {
        ScholarshipApplicationDto app = scholarshipService.applyForScholarship(currentUser.getId(), scholarshipId);
        return ResponseEntity.ok(ApiResponse.success("Applied for scholarship successfully", app));
    }

    @PostMapping("/admin/scholarships")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ScholarshipDto>> createScholarship(@RequestBody ScholarshipDto dto) {
        ScholarshipDto created = scholarshipService.createScholarship(dto);
        return ResponseEntity.ok(ApiResponse.success("Scholarship created successfully", created));
    }

    @GetMapping("/admin/scholarships/applications")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<ScholarshipApplicationDto>>> getAllScholarshipApplications(
            @RequestParam(required = false) ScholarshipStatus status) {
        List<ScholarshipApplicationDto> apps = scholarshipService.getAllScholarshipApplications(status);
        return ResponseEntity.ok(ApiResponse.success("Scholarship applications retrieved", apps));
    }

    @PutMapping("/admin/scholarships/applications/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<ScholarshipApplicationDto>> updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam ScholarshipStatus status,
            @RequestParam(required = false) String remarks,
            @RequestParam(required = false) Double approvedAmount,
            @RequestParam(required = false) String disbursementStatus) {
        ScholarshipApplicationDto updated = scholarshipService.updateScholarshipApplicationStatus(id, status, remarks, approvedAmount, disbursementStatus);
        return ResponseEntity.ok(ApiResponse.success("Scholarship application status updated", updated));
    }
}
