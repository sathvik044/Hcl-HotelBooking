package com.example.hotelbooking.security;

import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    
    // Fallback in-memory storage
    private final Map<String, UserDetails> users = new ConcurrentHashMap<>();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to load from DB by email
        java.util.Optional<User> dbUser = userRepository.findByEmail(username);
        if (dbUser.isPresent()) {
            User user = dbUser.get();
            return org.springframework.security.core.userdetails.User.builder()
                    .username(user.getEmail())
                    .password(user.getPassword())
                    .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
                    .disabled(user.isBlocked())
                    .build();
        }

        // Fallback to in-memory map
        UserDetails user = users.get(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        return user;
    }

    public void saveUser(UserDetails userDetails) {
        users.put(userDetails.getUsername(), userDetails);
    }

    public boolean userExists(String username) {
        return userRepository.findByEmail(username).isPresent() || users.containsKey(username);
    }
}
