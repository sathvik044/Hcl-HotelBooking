package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.response.UserResponse;
import com.example.hotelbooking.exception.UserNotFoundException;
import com.example.hotelbooking.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Slf4j
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.info("GET /api/admin/users invoked by admin");
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        log.info("GET /api/admin/users/{} invoked by admin", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/block/{id}")
    public ResponseEntity<UserResponse> blockUser(@PathVariable Long id) {
        log.info("PUT /api/admin/users/block/{} invoked by admin", id);
        UserResponse response = userService.blockUser(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/unblock/{id}")
    public ResponseEntity<UserResponse> unblockUser(@PathVariable Long id) {
        log.info("PUT /api/admin/users/unblock/{} invoked by admin", id);
        UserResponse response = userService.unblockUser(id);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UserNotFoundException ex) {
        log.warn("AdminUserController Local ExceptionHandler caught: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
