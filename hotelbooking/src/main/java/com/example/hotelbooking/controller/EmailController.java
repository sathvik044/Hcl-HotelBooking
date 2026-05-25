package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.email.EmailRequestDTO;
import com.example.hotelbooking.exception.EmailSendingException;
import com.example.hotelbooking.service.email.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * EmailController — provides REST endpoints to trigger email notifications.
 *
 * In production, emails are triggered internally by other service methods
 * (e.g., UserServiceImpl calls emailService.sendWelcomeEmail() after registration).
 * These endpoints serve as test/admin hooks and demonstrate the integration pattern.
 *
 * Architecture: Controller → Service → JavaMailSender
 */
@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    /**
     * POST /api/email/welcome
     * Sends a welcome email. Triggered internally after user registration.
     *
     * Required fields in body: to, userName
     */
    @PostMapping("/welcome")
    public ResponseEntity<String> sendWelcome(@Valid @RequestBody EmailRequestDTO dto) {
        log.info("POST /api/email/welcome triggered for: {}", dto.getTo());
        emailService.sendWelcomeEmail(dto);
        return ResponseEntity.ok("Welcome email sent to " + dto.getTo());
    }

    /**
     * POST /api/email/booking-confirmation
     * Sends a booking confirmation email.
     *
     * Required fields: to, userName, hotelName, roomType,
     *                  checkInDate, checkOutDate, bookingId
     */
    @PostMapping("/booking-confirmation")
    public ResponseEntity<String> sendBookingConfirmation(@Valid @RequestBody EmailRequestDTO dto) {
        log.info("POST /api/email/booking-confirmation triggered for bookingId: {}", dto.getBookingId());
        emailService.sendBookingConfirmationEmail(dto);
        return ResponseEntity.ok("Booking confirmation email sent to " + dto.getTo());
    }

    /**
     * POST /api/email/cancellation
     * Sends a booking cancellation email.
     *
     * Required fields: to, userName, hotelName, bookingId
     */
    @PostMapping("/cancellation")
    public ResponseEntity<String> sendCancellation(@Valid @RequestBody EmailRequestDTO dto) {
        log.info("POST /api/email/cancellation triggered for bookingId: {}", dto.getBookingId());
        emailService.sendCancellationEmail(dto);
        return ResponseEntity.ok("Cancellation email sent to " + dto.getTo());
    }

    /**
     * Handles EmailSendingException thrown within this controller.
     * Returns 500 INTERNAL SERVER ERROR with the failure reason.
     */
    @ExceptionHandler(EmailSendingException.class)
    public ResponseEntity<String> handleEmailSendingException(EmailSendingException ex) {
        log.error("EmailController - email sending failed: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Email sending failed: " + ex.getMessage());
    }
}
