package com.studenthub.controller;

import com.studenthub.dto.ApiResponse;
import com.studenthub.dto.MarkDto;
import com.studenthub.dto.MarkInputDto;
import com.studenthub.dto.SubjectDto;
import com.studenthub.security.UserPrincipal;
import com.studenthub.service.MarkService;
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
public class MarkController {

    @Autowired
    private MarkService markService;

    @GetMapping("/students/me/marks")
    public ResponseEntity<ApiResponse<List<MarkDto>>> getMyMarks(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<MarkDto> marks = markService.getStudentMarksByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Marks retrieved successfully", marks));
    }

    @GetMapping("/students/me/academic-summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyAcademicSummary(@AuthenticationPrincipal UserPrincipal currentUser) {
        Long studentId = markService.getStudentMarksByUserId(currentUser.getId()).stream()
                .findFirst().map(MarkDto::getStudentId).orElse(null);

        if (studentId == null) {
            return ResponseEntity.ok(ApiResponse.success("No marks available yet", Map.of()));
        }

        Map<String, Object> summary = markService.getStudentAcademicSummary(studentId);
        return ResponseEntity.ok(ApiResponse.success("Academic summary retrieved successfully", summary));
    }

    @GetMapping("/admin/marks/student/{studentId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudentAcademicSummaryAdmin(@PathVariable Long studentId) {
        Map<String, Object> summary = markService.getStudentAcademicSummary(studentId);
        return ResponseEntity.ok(ApiResponse.success("Student academic summary retrieved successfully", summary));
    }

    @PostMapping("/admin/marks")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<MarkDto>> addOrUpdateMark(@Valid @RequestBody MarkInputDto markInputDto) {
        MarkDto saved = markService.addOrUpdateMark(markInputDto);
        return ResponseEntity.ok(ApiResponse.success("Mark saved successfully", saved));
    }

    @DeleteMapping("/admin/marks/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMark(@PathVariable Long id) {
        markService.deleteMark(id);
        return ResponseEntity.ok(ApiResponse.success("Mark deleted successfully", null));
    }

    @GetMapping("/subjects")
    public ResponseEntity<ApiResponse<List<SubjectDto>>> getSubjects(@RequestParam(required = false) Integer semester) {
        List<SubjectDto> subjects = (semester != null) ? markService.getSubjectsBySemester(semester) : markService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success("Subjects retrieved successfully", subjects));
    }

    @PostMapping("/admin/subjects")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<SubjectDto>> createSubject(@RequestBody SubjectDto subjectDto) {
        SubjectDto created = markService.createSubject(subjectDto);
        return ResponseEntity.ok(ApiResponse.success("Subject created successfully", created));
    }
}
