package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.request.UserUpdateRequest;
import com.example.hotelbooking.dto.response.UserResponse;
import com.example.hotelbooking.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users/me
     * Returns the profile of the currently authenticated user.
     * Spring Security injects the logged-in UserDetails via @AuthenticationPrincipal.
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal UserDetails userDetails) {
        log.info("GET /api/users/me invoked for user: {}", userDetails.getUsername());
        UserResponse userResponse = userService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(userResponse);
    }

    /**
     * PUT /api/users/{id}
     * Updates the profile of the user identified by the given ID.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        log.info("PUT /api/users/{} invoked", id);
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(response);
    }

    
}
