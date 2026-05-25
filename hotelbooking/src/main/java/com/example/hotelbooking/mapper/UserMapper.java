package com.example.hotelbooking.mapper;

import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.dto.response.UserResponse;
import com.example.hotelbooking.dto.request.UserUpdateRequest;

public class UserMapper {

    public static UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .blocked(user.isBlocked())
                .build();
    }

    public static void updateEntity(UserUpdateRequest request, User user) {
        if (request == null || user == null) {
            return;
        }
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(request.getPassword());
        }
    }
}
