package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.request.UserUpdateRequest;
import com.example.hotelbooking.dto.response.UserResponse;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.exception.UserNotFoundException;
import com.example.hotelbooking.mapper.UserMapper;
import com.example.hotelbooking.repository.UserRepository;
import com.example.hotelbooking.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        log.info("Fetching current user profile for email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("User profile retrieval failed. Email: {} not found", email);
                    return new UserNotFoundException("User with email " + email + " not found");
                });
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        log.info("Updating user profile for user ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User update failed. ID: {} not found", id);
                    return new UserNotFoundException("User with ID " + id + " not found");
                });

        userMapper.updateEntity(request, user);
        User updatedUser = userRepository.save(user);
        log.info("Successfully updated user profile for user ID: {}", id);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        log.info("Retrieving all registered users (Admin action)");
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        log.info("Retrieving user profile by ID: {} (Admin action)", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User retrieval failed. ID: {} not found", id);
                    return new UserNotFoundException("User with ID " + id + " not found");
                });
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse blockUser(Long id) {
        log.info("Blocking user ID: {} (Admin action)", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User block failed. ID: {} not found", id);
                    return new UserNotFoundException("User with ID " + id + " not found");
                });

        user.setBlocked(true);
        User savedUser = userRepository.save(user);
        log.info("Successfully blocked user ID: {}", id);
        return userMapper.toResponse(savedUser);
    }

    @Override
    public UserResponse unblockUser(Long id) {
        log.info("Unblocking user ID: {} (Admin action)", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("User unblock failed. ID: {} not found", id);
                    return new UserNotFoundException("User with ID " + id + " not found");
                });

        user.setBlocked(false);
        User savedUser = userRepository.save(user);
        log.info("Successfully unblocked user ID: {}", id);
        return userMapper.toResponse(savedUser);
    }
}
