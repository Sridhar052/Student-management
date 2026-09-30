package com.studenthub.controller;

import com.studenthub.dto.AdminDashboardSummaryDto;
import com.studenthub.dto.ApiResponse;
import com.studenthub.dto.StudentDto;
import com.studenthub.service.AdminDashboardService;
import com.studenthub.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @Autowired
    private StudentService studentService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardSummaryDto>> getDashboardSummary() {
        AdminDashboardSummaryDto summary = adminDashboardService.getAdminDashboardSummary();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard metrics retrieved successfully", summary));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentDto>>> getAllStudents(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status) {
        List<StudentDto> students = studentService.getAllStudents(search, department, year, status);
        return ResponseEntity.ok(ApiResponse.success("Students retrieved successfully", students));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> getStudentById(@PathVariable Long id) {
        StudentDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success("Student details retrieved successfully", student));
    }

    @PostMapping("/students")
    public ResponseEntity<ApiResponse<StudentDto>> createStudent(@Valid @RequestBody StudentDto studentDto) {
        StudentDto created = studentService.createStudent(studentDto);
        return ResponseEntity.ok(ApiResponse.success("Student created successfully", created));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentDto>> updateStudent(@PathVariable Long id, @RequestBody StudentDto studentDto) {
        StudentDto updated = studentService.adminUpdateStudent(id, studentDto);
        return ResponseEntity.ok(ApiResponse.success("Student record updated successfully", updated));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deactivated successfully", null));
    }
}
