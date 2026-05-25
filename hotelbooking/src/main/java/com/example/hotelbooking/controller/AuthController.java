package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.request.LoginRequest;
import com.example.hotelbooking.dto.request.RegisterRequest;
import com.example.hotelbooking.dto.response.AuthResponse;
import com.example.hotelbooking.exception.AuthException;
import com.example.hotelbooking.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("REST request to register user: {}", request.getUsername());
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("REST request to login user: {}", request.getUsername());
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token != null && token.startsWith("Bearer ")) {
            authService.logout(token.substring(7));
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    // Module-specific exception handler
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<String> handleAuthException(AuthException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
    }

    // Handle validation errors locally
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<java.util.Map<String, String>> handleValidationExceptions(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {
        java.util.Map<String, String> errors = new java.util.HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((org.springframework.validation.FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
