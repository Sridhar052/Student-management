package com.studenthub.dto;

import com.studenthub.enums.Role;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String registerNumber;
    private Role role;
    private Long studentId;
    private String studentName;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String email, String registerNumber, Role role, Long studentId, String studentName) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.registerNumber = registerNumber;
        this.role = role;
        this.studentId = studentId;
        this.studentName = studentName;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
}
