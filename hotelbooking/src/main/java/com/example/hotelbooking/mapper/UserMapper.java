package com.example.hotelbooking.mapper;

import com.example.hotelbooking.dto.request.UserUpdateRequest;
import com.example.hotelbooking.dto.response.UserResponse;
import com.example.hotelbooking.entity.User;
import org.springframework.util.StringUtils;

public class UserMapper {

    private UserMapper() {
        // Utility class — prevent instantiation
    }

    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .blocked(user.isBlocked())
                .build();
    }

    public static void updateEntity(UserUpdateRequest request, User user) {
        java.util.Optional.ofNullable(request.getName())
                .ifPresent(user::setName);

        java.util.Optional.ofNullable(request.getPassword())
                .filter(StringUtils::hasText)
                .ifPresent(user::setPassword);
    }
}
