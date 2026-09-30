package com.studenthub.dto;

import com.studenthub.entity.Mark;

public class MarkDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private Long subjectId;
    private String subjectCode;
    private String subjectName;
    private Integer credits;
    private Double internalMarks;
    private Double externalMarks;
    private Double totalMarks;
    private String grade;
    private Double gradePoint;
    private String result;
    private Integer semester;
    private String academicYear;

    public MarkDto() {}

    public MarkDto(Mark mark) {
        this.id = mark.getId();
        if (mark.getStudent() != null) {
            this.studentId = mark.getStudent().getId();
            this.studentName = mark.getStudent().getFullName();
            this.registerNumber = mark.getStudent().getRegisterNumber();
        }
        if (mark.getSubject() != null) {
            this.subjectId = mark.getSubject().getId();
            this.subjectCode = mark.getSubject().getCode();
            this.subjectName = mark.getSubject().getName();
            this.credits = mark.getSubject().getCredits();
        }
        this.internalMarks = mark.getInternalMarks();
        this.externalMarks = mark.getExternalMarks();
        this.totalMarks = mark.getTotalMarks();
        this.grade = mark.getGrade();
        this.gradePoint = mark.getGradePoint();
        this.result = mark.getResult();
        this.semester = mark.getSemester();
        this.academicYear = mark.getAcademicYear();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
    public Double getInternalMarks() { return internalMarks; }
    public void setInternalMarks(Double internalMarks) { this.internalMarks = internalMarks; }
    public Double getExternalMarks() { return externalMarks; }
    public void setExternalMarks(Double externalMarks) { this.externalMarks = externalMarks; }
    public Double getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Double totalMarks) { this.totalMarks = totalMarks; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public Double getGradePoint() { return gradePoint; }
    public void setGradePoint(Double gradePoint) { this.gradePoint = gradePoint; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
