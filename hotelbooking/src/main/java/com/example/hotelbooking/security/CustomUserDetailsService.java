package com.example.hotelbooking.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Temporary in-memory storage until the User entity and repository are created by teammates
    private final Map<String, UserDetails> users = new ConcurrentHashMap<>();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.debug("Attempting to load user by username: {}", username);
        UserDetails user = users.get(username);
        if (user == null) {
            log.warn("User not found in memory: {}", username);
            throw new UsernameNotFoundException("User not found: " + username);
        }
        log.debug("Successfully loaded user: {}", username);
        return user;
    }

    public void saveUser(UserDetails userDetails) {
        log.debug("Saving user to memory: {}", userDetails.getUsername());
        users.put(userDetails.getUsername(), userDetails);
    }

    public boolean userExists(String username) {
        return users.containsKey(username);
    }
}
