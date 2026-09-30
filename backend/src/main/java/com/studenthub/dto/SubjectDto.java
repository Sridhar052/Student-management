package com.studenthub.dto;

import com.studenthub.entity.Subject;

public class SubjectDto {
    private Long id;
    private String code;
    private String name;
    private Integer credits;
    private Integer semester;
    private String department;

    public SubjectDto() {}

    public SubjectDto(Subject subject) {
        this.id = subject.getId();
        this.code = subject.getCode();
        this.name = subject.getName();
        this.credits = subject.getCredits();
        this.semester = subject.getSemester();
        this.department = subject.getDepartment();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
