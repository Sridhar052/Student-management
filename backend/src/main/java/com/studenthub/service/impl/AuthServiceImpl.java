package com.studenthub.service.impl;

import com.studenthub.dto.AuthRequest;
import com.studenthub.dto.AuthResponse;
import com.studenthub.dto.RegisterRequest;
import com.studenthub.entity.Student;
import com.studenthub.entity.User;
import com.studenthub.enums.Role;
import com.studenthub.exception.BadRequestException;
import com.studenthub.repository.StudentRepository;
import com.studenthub.repository.UserRepository;
import com.studenthub.security.JwtTokenProvider;
import com.studenthub.security.UserPrincipal;
import com.studenthub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getUsername(),
                        authRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new BadRequestException("User not found"));

        Long studentId = null;
        String studentName = user.getEmail();

        if (user.getRole() == Role.ROLE_STUDENT) {
            Optional<Student> studentOpt = studentRepository.findByUserId(user.getId());
            if (studentOpt.isPresent()) {
                studentId = studentOpt.get().getId();
                studentName = studentOpt.get().getFullName();
            }
        } else {
            studentName = "System Administrator";
        }

        return new AuthResponse(jwt, user.getId(), user.getEmail(), user.getRegisterNumber(), user.getRole(), studentId, studentName);
    }

    @Override
    @Transactional
    public AuthResponse registerStudent(RegisterRequest req) {
        if (userRepository.existsByRegisterNumber(req.getRegisterNumber())) {
            throw new BadRequestException("Register Number is already registered!");
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email is already in use!");
        }

        User user = new User();
        user.setRegisterNumber(req.getRegisterNumber());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole() : Role.ROLE_STUDENT);
        user = userRepository.save(user);

        Student student = new Student();
        student.setUser(user);
        student.setRegisterNumber(req.getRegisterNumber());
        student.setStudentId("STU" + System.currentTimeMillis() % 1000000);
        student.setFirstName(req.getFirstName());
        student.setLastName(req.getLastName());
        student.setEmail(req.getEmail());
        student.setDepartment(req.getDepartment() != null ? req.getDepartment() : "Computer Science");
        student.setCourse(req.getCourse() != null ? req.getCourse() : "B.Tech CSE");
        student.setYear(req.getYear() != null ? req.getYear() : 1);
        student.setSemester(req.getSemester() != null ? req.getSemester() : 1);
        student.setStatus("ACTIVE");
        student.setGpa(0.0);
        student.setCgpa(0.0);
        student.setAttendancePercentage(90.0);
        studentRepository.save(student);

        AuthRequest authReq = new AuthRequest(req.getRegisterNumber(), req.getPassword(), false);
        return login(authReq);
    }
}
