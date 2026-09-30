package com.studenthub.service.impl;

import com.studenthub.dto.MarkDto;
import com.studenthub.dto.MarkInputDto;
import com.studenthub.dto.SubjectDto;
import com.studenthub.entity.Mark;
import com.studenthub.entity.Student;
import com.studenthub.entity.Subject;
import com.studenthub.exception.ResourceNotFoundException;
import com.studenthub.repository.MarkRepository;
import com.studenthub.repository.StudentRepository;
import com.studenthub.repository.SubjectRepository;
import com.studenthub.service.MarkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarkServiceImpl implements MarkService {

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    public List<MarkDto> getStudentMarks(Long studentId) {
        return markRepository.findByStudentId(studentId)
                .stream().map(MarkDto::new).collect(Collectors.toList());
    }

    @Override
    public List<MarkDto> getStudentMarksByUserId(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return getStudentMarks(student.getId());
    }

    @Override
    public List<MarkDto> getStudentMarksBySemester(Long studentId, Integer semester) {
        return markRepository.findByStudentIdAndSemester(studentId, semester)
                .stream().map(MarkDto::new).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getStudentAcademicSummary(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        List<Mark> allMarks = markRepository.findByStudentId(studentId);
        Map<Integer, List<Mark>> bySem = allMarks.stream().collect(Collectors.groupingBy(Mark::getSemester));

        Map<Integer, Map<String, Object>> semesterDetails = new TreeMap<>();
        double totalWeightedGpa = 0.0;
        int totalSemestersCount = 0;

        for (Map.Entry<Integer, List<Mark>> entry : bySem.entrySet()) {
            Integer sem = entry.getKey();
            List<Mark> semMarks = entry.getValue();

            double semGradePoints = 0.0;
            int semCredits = 0;
            for (Mark m : semMarks) {
                int c = m.getSubject() != null && m.getSubject().getCredits() != null ? m.getSubject().getCredits() : 3;
                semGradePoints += (m.getGradePoint() != null ? m.getGradePoint() : 0.0) * c;
                semCredits += c;
            }
            double semGpa = semCredits > 0 ? Math.round((semGradePoints / semCredits) * 100.0) / 100.0 : 0.0;

            Map<String, Object> semData = new HashMap<>();
            semData.put("semester", sem);
            semData.put("gpa", semGpa);
            semData.put("totalCredits", semCredits);
            semData.put("marks", semMarks.stream().map(MarkDto::new).collect(Collectors.toList()));

            semesterDetails.put(sem, semData);

            if (semCredits > 0) {
                totalWeightedGpa += semGpa;
                totalSemestersCount++;
            }
        }

        double overallCgpa = totalSemestersCount > 0 ? Math.round((totalWeightedGpa / totalSemestersCount) * 100.0) / 100.0 : 0.0;

        Map<String, Object> summary = new HashMap<>();
        summary.put("studentId", student.getId());
        summary.put("studentName", student.getFullName());
        summary.put("registerNumber", student.getRegisterNumber());
        summary.put("cgpa", overallCgpa);
        summary.put("semesters", semesterDetails);

        return summary;
    }

    @Override
    @Transactional
    public MarkDto addOrUpdateMark(MarkInputDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudentId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + dto.getSubjectId()));

        Optional<Mark> existingOpt = markRepository.findByStudentIdAndSubjectId(dto.getStudentId(), dto.getSubjectId());
        Mark mark = existingOpt.orElseGet(Mark::new);

        mark.setStudent(student);
        mark.setSubject(subject);
        mark.setInternalMarks(dto.getInternalMarks());
        mark.setExternalMarks(dto.getExternalMarks());
        mark.setSemester(dto.getSemester() != null ? dto.getSemester() : subject.getSemester());
        mark.setAcademicYear(dto.getAcademicYear());

        mark.calculateGradeAndResult();
        Mark saved = markRepository.save(mark);

        // Update Student CGPA & GPA in profile
        updateStudentGpaAndCgpa(student.getId());

        return new MarkDto(saved);
    }

    private void updateStudentGpaAndCgpa(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return;

        List<Mark> allMarks = markRepository.findByStudentId(studentId);
        if (allMarks.isEmpty()) return;

        Map<Integer, List<Mark>> semGroups = allMarks.stream().collect(Collectors.groupingBy(Mark::getSemester));
        double sumGpa = 0.0;
        int semCount = 0;
        double currentSemGpa = 0.0;

        for (Map.Entry<Integer, List<Mark>> entry : semGroups.entrySet()) {
            double pts = 0.0;
            int creds = 0;
            for (Mark m : entry.getValue()) {
                int c = m.getSubject() != null && m.getSubject().getCredits() != null ? m.getSubject().getCredits() : 3;
                pts += (m.getGradePoint() != null ? m.getGradePoint() : 0.0) * c;
                creds += c;
            }
            double semGpa = creds > 0 ? pts / creds : 0.0;
            sumGpa += semGpa;
            semCount++;

            if (student.getSemester() != null && entry.getKey().equals(student.getSemester())) {
                currentSemGpa = semGpa;
            }
        }

        double cgpa = semCount > 0 ? sumGpa / semCount : 0.0;
        student.setCgpa(Math.round(cgpa * 100.0) / 100.0);
        student.setGpa(Math.round((currentSemGpa > 0 ? currentSemGpa : cgpa) * 100.0) / 100.0);
        studentRepository.save(student);
    }

    @Override
    @Transactional
    public void deleteMark(Long id) {
        Mark mark = markRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mark not found with ID: " + id));
        Long studentId = mark.getStudent().getId();
        markRepository.delete(mark);
        updateStudentGpaAndCgpa(studentId);
    }

    @Override
    public List<SubjectDto> getAllSubjects() {
        return subjectRepository.findAll().stream().map(SubjectDto::new).collect(Collectors.toList());
    }

    @Override
    public List<SubjectDto> getSubjectsBySemester(Integer semester) {
        return subjectRepository.findBySemester(semester).stream().map(SubjectDto::new).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubjectDto createSubject(SubjectDto dto) {
        Subject subject = new Subject();
        subject.setCode(dto.getCode());
        subject.setName(dto.getName());
        subject.setCredits(dto.getCredits() != null ? dto.getCredits() : 3);
        subject.setSemester(dto.getSemester() != null ? dto.getSemester() : 1);
        subject.setDepartment(dto.getDepartment() != null ? dto.getDepartment() : "Computer Science");
        Subject saved = subjectRepository.save(subject);
        return new SubjectDto(saved);
    }
}
