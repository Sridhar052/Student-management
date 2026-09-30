package com.studenthub.service;

import com.studenthub.dto.ScholarshipApplicationDto;
import com.studenthub.dto.ScholarshipDto;
import com.studenthub.enums.ScholarshipStatus;

import java.util.List;

public interface ScholarshipService {
    List<ScholarshipDto> getAllScholarships();
    ScholarshipDto getScholarshipById(Long id);
    ScholarshipDto createScholarship(ScholarshipDto dto);
    ScholarshipApplicationDto applyForScholarship(Long userId, Long scholarshipId);
    List<ScholarshipApplicationDto> getStudentScholarshipApplications(Long studentId);
    List<ScholarshipApplicationDto> getStudentScholarshipApplicationsByUserId(Long userId);
    List<ScholarshipApplicationDto> getAllScholarshipApplications(ScholarshipStatus status);
    ScholarshipApplicationDto updateScholarshipApplicationStatus(Long applicationId, ScholarshipStatus status, String remarks, Double approvedAmount, String disbursementStatus);
}
