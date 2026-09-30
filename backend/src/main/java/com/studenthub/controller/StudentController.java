package com.studenthub.controller;

import com.studenthub.dto.ApiResponse;
import com.studenthub.dto.DashboardSummaryDto;
import com.studenthub.dto.StudentDto;
import com.studenthub.dto.StudentUpdateDto;
import com.studenthub.security.UserPrincipal;
import com.studenthub.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentDto>> getCurrentStudent(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentDto student = studentService.getStudentByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Student profile fetched successfully", student));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentDto>> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                 @RequestBody StudentUpdateDto updateDto) {
        StudentDto updated = studentService.updateStudentProfile(currentUser.getId(), updateDto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/me/dashboard")
    public ResponseEntity<ApiResponse<DashboardSummaryDto>> getDashboardSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        DashboardSummaryDto summary = studentService.getStudentDashboardSummary(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Dashboard summary fetched successfully", summary));
    }
}
