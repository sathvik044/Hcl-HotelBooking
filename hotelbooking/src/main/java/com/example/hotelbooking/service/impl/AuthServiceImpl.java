package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.request.LoginRequest;
import com.example.hotelbooking.dto.request.RegisterRequest;
import com.example.hotelbooking.dto.response.AuthResponse;
import com.example.hotelbooking.enums.UserRole;
import com.example.hotelbooking.exception.AuthException;
import com.example.hotelbooking.repository.UserRepository;
import com.example.hotelbooking.security.CustomUserDetailsService;
import com.example.hotelbooking.security.JwtUtil;
import com.example.hotelbooking.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AuthException("Email already exists");
        }

        // Determine role (e.g. if name/email has "admin", make them admin, otherwise USER)
        UserRole role = UserRole.USER;
        if (request.getUsername().toLowerCase().contains("admin") || request.getEmail().toLowerCase().contains("admin")) {
            role = UserRole.ADMIN;
        }

        com.example.hotelbooking.entity.User userEntity = com.example.hotelbooking.entity.User.builder()
                .email(request.getEmail())
                .name(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .blocked(false)
                .build();

        userRepository.save(userEntity);

        // Also save user to in-memory details fallback
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(request.getEmail())
                .password(userEntity.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name())))
                .build();

        userDetailsService.saveUser(userDetails);
        
        String jwtToken = jwtUtil.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .message("User registered successfully")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            throw new AuthException("Invalid username or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String jwtToken = jwtUtil.generateToken(userDetails);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .message("Login successful")
                .build();
    }

    @Override
    public void logout(String token) {
        // In a stateless JWT setup, logout is typically handled client-side by deleting the token.
        // For enhanced security, a token blacklist could be implemented here.
    }
}
