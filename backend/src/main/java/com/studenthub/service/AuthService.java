package com.studenthub.service;

import com.studenthub.dto.AuthRequest;
import com.studenthub.dto.AuthResponse;
import com.studenthub.dto.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest authRequest);
    AuthResponse registerStudent(RegisterRequest registerRequest);
}
