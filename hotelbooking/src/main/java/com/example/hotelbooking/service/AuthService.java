package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.request.LoginRequest;
import com.example.hotelbooking.dto.request.RegisterRequest;
import com.example.hotelbooking.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void logout(String token);
}
