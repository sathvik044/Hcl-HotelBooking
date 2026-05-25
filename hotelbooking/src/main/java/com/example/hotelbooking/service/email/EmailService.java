package com.example.hotelbooking.service.email;

import com.example.hotelbooking.dto.email.EmailRequestDTO;

/**
 * Contract for the Email Notification Service.
 *
 * Exposes three reusable methods that teammates can inject and call:
 *   - sendWelcomeEmail()           → called after user registration
 *   - sendBookingConfirmationEmail() → called after successful booking
 *   - sendCancellationEmail()      → called after booking cancellation
 */
public interface EmailService {

    /**
     * Sends a welcome email to a newly registered user.
     *
     * @param dto must contain: to, userName
     */
    void sendWelcomeEmail(EmailRequestDTO dto);

    /**
     * Sends a booking confirmation email with full reservation details.
     *
     * @param dto must contain: to, userName, hotelName, roomType,
     *            checkInDate, checkOutDate, bookingId
     */
    void sendBookingConfirmationEmail(EmailRequestDTO dto);

    /**
     * Sends a booking cancellation notification email.
     *
     * @param dto must contain: to, userName, hotelName, bookingId,
     *            cancellationReason (optional)
     */
    void sendCancellationEmail(EmailRequestDTO dto);
}
