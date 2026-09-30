package com.studenthub.dto;

import com.studenthub.entity.Student;
import java.time.LocalDate;

public class StudentDto {
    private Long id;
    private Long userId;
    private String registerNumber;
    private String studentId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String gender;
    private LocalDate dob;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private String department;
    private String course;
    private String batch;
    private Integer year;
    private Integer semester;
    private String section;
    private LocalDate admissionDate;
    private String parentName;
    private String parentRelation;
    private String parentPhone;
    private String parentEmail;
    private String profileImage;
    private String status;
    private Double gpa;
    private Double cgpa;
    private Double attendancePercentage;

    public StudentDto() {}

    public StudentDto(Student s) {
        this.id = s.getId();
        if (s.getUser() != null) this.userId = s.getUser().getId();
        this.registerNumber = s.getRegisterNumber();
        this.studentId = s.getStudentId();
        this.firstName = s.getFirstName();
        this.lastName = s.getLastName();
        this.fullName = s.getFullName();
        this.gender = s.getGender();
        this.dob = s.getDob();
        this.phone = s.getPhone();
        this.email = s.getEmail();
        this.address = s.getAddress();
        this.city = s.getCity();
        this.district = s.getDistrict();
        this.state = s.getState();
        this.pincode = s.getPincode();
        this.department = s.getDepartment();
        this.course = s.getCourse();
        this.batch = s.getBatch();
        this.year = s.getYear();
        this.semester = s.getSemester();
        this.section = s.getSection();
        this.admissionDate = s.getAdmissionDate();
        this.parentName = s.getParentName();
        this.parentRelation = s.getParentRelation();
        this.parentPhone = s.getParentPhone();
        this.parentEmail = s.getParentEmail();
        this.profileImage = s.getProfileImage();
        this.status = s.getStatus();
        this.gpa = s.getGpa();
        this.cgpa = s.getCgpa();
        this.attendancePercentage = s.getAttendancePercentage();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate admissionDate) { this.admissionDate = admissionDate; }
    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }
    public String getParentRelation() { return parentRelation; }
    public void setParentRelation(String parentRelation) { this.parentRelation = parentRelation; }
    public String getParentPhone() { return parentPhone; }
    public void setParentPhone(String parentPhone) { this.parentPhone = parentPhone; }
    public String getParentEmail() { return parentEmail; }
    public void setParentEmail(String parentEmail) { this.parentEmail = parentEmail; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public Double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
}
