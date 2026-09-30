package com.studenthub.service;

import com.studenthub.dto.DashboardSummaryDto;
import com.studenthub.dto.StudentDto;
import com.studenthub.dto.StudentUpdateDto;

import java.util.List;

public interface StudentService {
    StudentDto getStudentByUserId(Long userId);
    StudentDto getStudentById(Long id);
    StudentDto updateStudentProfile(Long userId, StudentUpdateDto updateDto);
    StudentDto adminUpdateStudent(Long id, StudentDto studentDto);
    StudentDto createStudent(StudentDto studentDto);
    void deleteStudent(Long id);
    List<StudentDto> getAllStudents(String search, String department, Integer year, String status);
    DashboardSummaryDto getStudentDashboardSummary(Long userId);
}
