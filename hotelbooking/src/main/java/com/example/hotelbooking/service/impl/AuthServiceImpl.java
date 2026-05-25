package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.request.LoginRequest;
import com.example.hotelbooking.dto.request.RegisterRequest;
import com.example.hotelbooking.dto.response.AuthResponse;
import com.example.hotelbooking.exception.AuthException;
import com.example.hotelbooking.security.CustomUserDetailsService;
import com.example.hotelbooking.security.JwtUtil;
import com.example.hotelbooking.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
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

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userDetailsService.userExists(request.getUsername())) {
            throw new AuthException("Username already exists");
        }

        // Creating a temporary in-memory UserDetails object.
        // Once the User entity is ready, this should be changed to save the User entity to the DB.
        UserDetails user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        userDetailsService.saveUser(user);
        
        String jwtToken = jwtUtil.generateToken(user);
        
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
