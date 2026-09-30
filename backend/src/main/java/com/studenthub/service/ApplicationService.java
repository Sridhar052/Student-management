package com.studenthub.service;

import com.studenthub.dto.ApplicationCreateDto;
import com.studenthub.dto.ApplicationDto;
import com.studenthub.dto.ApplicationStatusUpdateDto;
import com.studenthub.enums.ApplicationStatus;
import com.studenthub.enums.ApplicationType;

import java.util.List;
import java.util.Map;

public interface ApplicationService {
    List<ApplicationDto> getStudentApplications(Long studentId);
    List<ApplicationDto> getStudentApplicationsByUserId(Long userId);
    ApplicationDto createApplication(Long userId, ApplicationCreateDto createDto);
    ApplicationDto getApplicationById(Long id);
    ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatusUpdateDto updateDto, String updatedBy);
    List<ApplicationDto> getAllApplications(ApplicationType type, ApplicationStatus status, String department);
    Map<String, Object> getApplicationDetailsWithHistory(Long id);
}
