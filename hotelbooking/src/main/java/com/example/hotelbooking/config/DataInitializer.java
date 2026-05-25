package com.example.hotelbooking.config;

import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.enums.UserRole;
import com.example.hotelbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default admin account
        if (userRepository.findByEmail("admin@hotel.com").isEmpty()) {
            User admin = User.builder()
                    .email("admin@hotel.com")
                    .name("Alex Rivera (Admin)")
                    .password(passwordEncoder.encode("password"))
                    .role(UserRole.ADMIN)
                    .blocked(false)
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin account: admin@hotel.com");
        }

        // Seed default standard user account
        if (userRepository.findByEmail("user@hotel.com").isEmpty()) {
            User user = User.builder()
                    .email("user@hotel.com")
                    .name("Sarah Jenkins")
                    .password(passwordEncoder.encode("password"))
                    .role(UserRole.USER)
                    .blocked(false)
                    .build();
            userRepository.save(user);
            log.info("Seeded default standard user account: user@hotel.com");
        }
    }
}
