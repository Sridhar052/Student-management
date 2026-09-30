package com.studenthub.service;

import com.studenthub.dto.MarkDto;
import com.studenthub.dto.MarkInputDto;
import com.studenthub.dto.SubjectDto;

import java.util.List;
import java.util.Map;

public interface MarkService {
    List<MarkDto> getStudentMarks(Long studentId);
    List<MarkDto> getStudentMarksByUserId(Long userId);
    List<MarkDto> getStudentMarksBySemester(Long studentId, Integer semester);
    Map<String, Object> getStudentAcademicSummary(Long studentId);
    MarkDto addOrUpdateMark(MarkInputDto markInputDto);
    void deleteMark(Long id);
    List<SubjectDto> getAllSubjects();
    List<SubjectDto> getSubjectsBySemester(Integer semester);
    SubjectDto createSubject(SubjectDto subjectDto);
}
