package com.example.hotelbooking.mapper;

import com.example.hotelbooking.dto.request.RegisterRequest;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.dto.response.UserResponse;
import com.example.hotelbooking.dto.request.UserUpdateRequest;
import com.example.hotelbooking.enums.UserRole;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
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

    public void updateEntity(UserUpdateRequest request, User user) {
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

    public User toEntity(RegisterRequest request, String encodedPassword, UserRole role) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .email(request.getEmail())
                .name(request.getUsername())
                .password(encodedPassword)
                .role(role)
                .blocked(false)
                .build();
    }

    public org.springframework.security.core.userdetails.UserDetails toUserDetails(User user) {
        if (user == null) {
            return null;
        }
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(java.util.Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                .build();
    }
}
