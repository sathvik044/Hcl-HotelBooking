package com.example.hotelbooking.controller;

import com.example.hotelbooking.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    /**
     * Sends a test welcome email to the specified address.
     * Accessible by authenticated users to verify SMTP connection.
     * 
     * @param email Recipient email
     * @param name  Recipient name
     * @return Confirmation message
     */
    @PostMapping("/test-welcome")
    public ResponseEntity<String> sendTestWelcomeEmail(@RequestParam String email, @RequestParam String name) {
        log.info("Received request to send test welcome email to: {}", email);
        emailService.sendWelcomeEmail(email, name);
        return ResponseEntity.ok("Welcome email request dispatched for processing.");
    }

    /**
     * Sends a test booking confirmation email to the specified address.
     * Accessible by administrators to verify booking template layouts.
     * 
     * @param email Recipient email
     * @param name  Recipient name
     * @return Confirmation message
     */
    @PostMapping("/test-confirmation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> sendTestConfirmationEmail(@RequestParam String email, @RequestParam String name) {
        log.info("Received request to send test confirmation email to: {}", email);
        emailService.sendBookingConfirmationEmail(
            email, 
            name, 
            "The Grand Antigravity Resort & Spa", 
            "Penthouse Suite", 
            "2026-06-01", 
            "2026-06-08", 
            99999L
        );
        return ResponseEntity.ok("Confirmation email request dispatched for processing.");
    }
}
