package com.example.hotelbooking.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    // Temporary in-memory storage until the User entity and repository are created by teammates
    private final Map<String, UserDetails> users = new ConcurrentHashMap<>();

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
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
        return users.containsKey(username);
    }
}
