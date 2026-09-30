package com.studenthub.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks")
public class Mark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    private Double internalMarks;
    private Double externalMarks;
    private Double totalMarks;

    private String grade;
    private Double gradePoint;
    private String result; // PASS, FAIL, ARREAR

    private Integer semester;
    private String academicYear;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        calculateGradeAndResult();
    }

    @PreUpdate
    protected void onUpdate() {
        calculateGradeAndResult();
    }

    public void calculateGradeAndResult() {
        double internal = internalMarks != null ? internalMarks : 0.0;
        double external = externalMarks != null ? externalMarks : 0.0;
        this.totalMarks = internal + external;

        if (this.totalMarks >= 90) {
            this.grade = "O";
            this.gradePoint = 10.0;
        } else if (this.totalMarks >= 80) {
            this.grade = "A+";
            this.gradePoint = 9.0;
        } else if (this.totalMarks >= 70) {
            this.grade = "A";
            this.gradePoint = 8.0;
        } else if (this.totalMarks >= 60) {
            this.grade = "B+";
            this.gradePoint = 7.0;
        } else if (this.totalMarks >= 50) {
            this.grade = "B";
            this.gradePoint = 6.0;
        } else {
            this.grade = "F";
            this.gradePoint = 0.0;
        }

        this.result = (internal >= 15 && external >= 35 && totalMarks >= 50) ? "PASS" : "FAIL";
    }

    public Mark() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
