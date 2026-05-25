package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.request.UserUpdateRequest;
import com.example.hotelbooking.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse getCurrentUser(String email);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse blockUser(Long id);

    UserResponse unblockUser(Long id);
}
