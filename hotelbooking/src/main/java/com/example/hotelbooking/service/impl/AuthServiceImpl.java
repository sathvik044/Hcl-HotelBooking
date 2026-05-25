package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.request.LoginRequest;
import com.example.hotelbooking.dto.request.RegisterRequest;
import com.example.hotelbooking.dto.response.AuthResponse;
import com.example.hotelbooking.exception.AuthException;
import com.example.hotelbooking.security.CustomUserDetailsService;
import com.example.hotelbooking.security.JwtUtil;
import com.example.hotelbooking.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing registration request for user: {}", request.getUsername());

        if (userDetailsService.userExists(request.getUsername())) {
            log.warn("Registration failed: Username '{}' already exists", request.getUsername());
            throw new AuthException("Username already exists");
        }

        // TODO: Map request.getEmail() to the actual User entity once it is created by the team.
        UserDetails user = new User(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );

        userDetailsService.saveUser(user);
        log.info("User '{}' registered successfully", request.getUsername());

        String jwtToken = jwtUtil.generateToken(user);
        return AuthResponse.builder()
                .token(jwtToken)
                .message("User registered successfully")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Processing login request for user: {}", request.getUsername());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
            
            // Using the authenticated principal is safer and avoids a redundant database lookup
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwtToken = jwtUtil.generateToken(userDetails);
            
            log.info("User '{}' logged in successfully", request.getUsername());
            
            return AuthResponse.builder()
                    .token(jwtToken)
                    .message("Login successful")
                    .build();

        } catch (BadCredentialsException e) {
            log.warn("Login failed for user '{}': Bad credentials", request.getUsername());
            throw new AuthException("Invalid username or password");
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user '{}': {}", request.getUsername(), e.getMessage());
            throw new AuthException("Authentication failed");
        }
    }

    @Override
    public void logout(String token) {
        log.info("Processing logout request for token starting with: {}", 
                (token != null && token.length() > 10) ? token.substring(0, 10) + "..." : "Invalid/Empty Token");
    }
}
