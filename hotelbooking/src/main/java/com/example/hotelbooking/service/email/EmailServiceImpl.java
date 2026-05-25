package com.example.hotelbooking.service.email;

import com.example.hotelbooking.dto.email.EmailRequestDTO;
import com.example.hotelbooking.exception.EmailSendingException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Production-ready Email Service implementation.
 *
 * Uses:
 *  - SimpleMailMessage  → plain-text emails
 *  - MimeMessage        → rich HTML emails (used for all 3 notifications)
 *
 * All methods follow the pattern:
 *   1. Log the intent
 *   2. Build the email
 *   3. Send via JavaMailSender
 *   4. Log success or catch and wrap exceptions
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    // ── Sender display name ──────────────────────────────────────────────────
    private static final String FROM_NAME    = "Hotel Booking App";
    private static final String FROM_ADDRESS = "noreply@hotelbooking.com";

    // ────────────────────────────────────────────────────────────────────────
    //  1. WELCOME EMAIL  (plain-text + HTML versions shown)
    // ────────────────────────────────────────────────────────────────────────

    @Override
    public void sendWelcomeEmail(EmailRequestDTO dto) {
        log.info("Sending welcome email to: {}", dto.getTo());
        String subject = "Welcome to Hotel Booking Application!";
        String htmlBody = buildWelcomeHtml(dto.getUserName());
        sendHtmlEmail(dto.getTo(), subject, htmlBody);
        log.info("Welcome email sent successfully to: {}", dto.getTo());
    }

    // ────────────────────────────────────────────────────────────────────────
    //  2. BOOKING CONFIRMATION EMAIL
    // ────────────────────────────────────────────────────────────────────────

    @Override
    public void sendBookingConfirmationEmail(EmailRequestDTO dto) {
        log.info("Sending booking confirmation email to: {} for bookingId: {}",
                dto.getTo(), dto.getBookingId());
        String subject = "Booking Confirmation – " + dto.getHotelName();
        String htmlBody = buildBookingConfirmationHtml(dto);
        sendHtmlEmail(dto.getTo(), subject, htmlBody);
        log.info("Booking confirmation email sent successfully to: {}", dto.getTo());
    }

    // ────────────────────────────────────────────────────────────────────────
    //  3. CANCELLATION EMAIL
    // ────────────────────────────────────────────────────────────────────────

    @Override
    public void sendCancellationEmail(EmailRequestDTO dto) {
        log.info("Sending cancellation email to: {} for bookingId: {}",
                dto.getTo(), dto.getBookingId());
        String subject = "Booking Cancelled – " + dto.getHotelName();
        String htmlBody = buildCancellationHtml(dto);
        sendHtmlEmail(dto.getTo(), subject, htmlBody);
        log.info("Cancellation email sent successfully to: {}", dto.getTo());
    }

    // ────────────────────────────────────────────────────────────────────────
    //  CORE SEND METHODS
    // ────────────────────────────────────────────────────────────────────────

    /**
     * Sends a plain-text email using SimpleMailMessage.
     * Lightweight — use when HTML formatting is not required.
     */
    public void sendPlainTextEmail(String to, String subject, String text) {
        log.debug("Preparing plain-text email to: {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(FROM_ADDRESS);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Plain-text email sent successfully to: {}", to);
        } catch (MailAuthenticationException ex) {
            log.error("Mail authentication failed for: {}. Check SMTP credentials.", to, ex);
            throw new EmailSendingException("Mail authentication failed: " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Failed to send plain-text email to: {}", to, ex);
            throw new EmailSendingException("Failed to send email to " + to + ": " + ex.getMessage(), ex);
        }
    }

    /**
     * Sends an HTML email using MimeMessage + MimeMessageHelper.
     * Used for all three notification types (welcome, confirmation, cancellation).
     */
    private void sendHtmlEmail(String to, String subject, String htmlBody) {
        log.debug("Preparing HTML email to: {}", to);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(FROM_ADDRESS, FROM_NAME);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = isHtml
            mailSender.send(message);
        } catch (MailAuthenticationException ex) {
            log.error("Mail authentication failed while sending to: {}. Verify SMTP username/password.", to, ex);
            throw new EmailSendingException("Mail authentication failed: " + ex.getMessage(), ex);
        } catch (MessagingException ex) {
            log.error("Messaging error while constructing email for: {}", to, ex);
            throw new EmailSendingException("Messaging error for " + to + ": " + ex.getMessage(), ex);
        } catch (Exception ex) {
            log.error("Unexpected error sending HTML email to: {}", to, ex);
            throw new EmailSendingException("Failed to send email to " + to + ": " + ex.getMessage(), ex);
        }
    }

    // ────────────────────────────────────────────────────────────────────────
    //  HTML TEMPLATE BUILDERS
    // ────────────────────────────────────────────────────────────────────────

    private String buildWelcomeHtml(String userName) {
        return "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
               "<style>" +
               "body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f6f8;margin:0;padding:0;}" +
               ".wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;" +
               "box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;}" +
               ".header{background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:40px 30px;text-align:center;color:#fff;}" +
               ".header h1{margin:0;font-size:26px;font-weight:700;}" +
               ".body{padding:36px 30px;color:#374151;line-height:1.7;}" +
               ".body h2{color:#111827;font-size:20px;}" +
               ".footer{background:#f9fafb;padding:20px 30px;text-align:center;font-size:13px;color:#9ca3af;border-top:1px solid #f1f5f9;}" +
               "</style></head><body>" +
               "<div class='wrapper'>" +
               "<div class='header'><h1>Welcome to Hotel Booking!</h1></div>" +
               "<div class='body'>" +
               "<h2>Hello " + userName + ",</h2>" +
               "<p>Thank you for registering with us! Your account is now active and ready to use.</p>" +
               "<p>Browse thousands of hotels, compare prices, and book your perfect stay — all in one place.</p>" +
               "</div>" +
               "<div class='footer'>&copy; 2026 Hotel Booking Application. All rights reserved.</div>" +
               "</div></body></html>";
    }

    private String buildBookingConfirmationHtml(EmailRequestDTO dto) {
        return "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
               "<style>" +
               "body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f6f8;margin:0;padding:0;}" +
               ".wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;" +
               "box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;}" +
               ".header{background:linear-gradient(135deg,#059669,#10b981);padding:40px 30px;text-align:center;color:#fff;}" +
               ".header h1{margin:0;font-size:26px;font-weight:700;}" +
               ".body{padding:36px 30px;color:#374151;line-height:1.7;}" +
               ".card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin:20px 0;}" +
               ".row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #e5e7eb;font-size:15px;}" +
               ".row:last-child{border-bottom:none;}" +
               ".label{color:#6b7280;font-weight:500;}" +
               ".value{color:#111827;font-weight:600;}" +
               ".footer{background:#f9fafb;padding:20px 30px;text-align:center;font-size:13px;color:#9ca3af;border-top:1px solid #f1f5f9;}" +
               "</style></head><body>" +
               "<div class='wrapper'>" +
               "<div class='header'><h1>&#10003; Booking Confirmed!</h1></div>" +
               "<div class='body'>" +
               "<p>Hello <strong>" + dto.getUserName() + "</strong>,</p>" +
               "<p>Your reservation has been confirmed. Here are your booking details:</p>" +
               "<div class='card'>" +
               "<div class='row'><span class='label'>Booking ID</span><span class='value'>" + dto.getBookingId() + "</span></div>" +
               "<div class='row'><span class='label'>Hotel</span><span class='value'>" + dto.getHotelName() + "</span></div>" +
               "<div class='row'><span class='label'>Room Type</span><span class='value'>" + dto.getRoomType() + "</span></div>" +
               "<div class='row'><span class='label'>Check-in</span><span class='value'>" + dto.getCheckInDate() + "</span></div>" +
               "<div class='row'><span class='label'>Check-out</span><span class='value'>" + dto.getCheckOutDate() + "</span></div>" +
               "</div>" +
               "<p>Please keep this email as your booking reference.</p>" +
               "</div>" +
               "<div class='footer'>&copy; 2026 Hotel Booking Application. All rights reserved.</div>" +
               "</div></body></html>";
    }

    private String buildCancellationHtml(EmailRequestDTO dto) {
        return "<!DOCTYPE html><html><head><meta charset='utf-8'>" +
               "<style>" +
               "body{font-family:'Helvetica Neue',Arial,sans-serif;background:#f4f6f8;margin:0;padding:0;}" +
               ".wrapper{max-width:600px;margin:40px auto;background:#fff;border-radius:12px;" +
               "box-shadow:0 4px 20px rgba(0,0,0,.08);overflow:hidden;}" +
               ".header{background:linear-gradient(135deg,#dc2626,#f87171);padding:40px 30px;text-align:center;color:#fff;}" +
               ".header h1{margin:0;font-size:26px;font-weight:700;}" +
               ".body{padding:36px 30px;color:#374151;line-height:1.7;}" +
               ".alert{background:#fffbeb;border-left:4px solid #f59e0b;border-radius:6px;padding:16px;margin:20px 0;color:#92400e;}" +
               ".card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin:20px 0;}" +
               ".row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px dashed #e5e7eb;font-size:15px;}" +
               ".row:last-child{border-bottom:none;}" +
               ".label{color:#6b7280;font-weight:500;}" +
               ".value{color:#111827;font-weight:600;}" +
               ".footer{background:#f9fafb;padding:20px 30px;text-align:center;font-size:13px;color:#9ca3af;border-top:1px solid #f1f5f9;}" +
               "</style></head><body>" +
               "<div class='wrapper'>" +
               "<div class='header'><h1>Booking Cancelled</h1></div>" +
               "<div class='body'>" +
               "<p>Hello <strong>" + dto.getUserName() + "</strong>,</p>" +
               "<p>Your booking has been successfully cancelled. Details are below:</p>" +
               "<div class='card'>" +
               "<div class='row'><span class='label'>Booking ID</span><span class='value'>" + dto.getBookingId() + "</span></div>" +
               "<div class='row'><span class='label'>Hotel</span><span class='value'>" + dto.getHotelName() + "</span></div>" +
               "</div>" +
               "<div class='alert'><strong>Reason:</strong> " +
               (dto.getCancellationReason() != null ? dto.getCancellationReason() : "Cancelled by user") +
               "</div>" +
               "<p>If a refund is applicable, it will be processed within 5–7 business days.</p>" +
               "</div>" +
               "<div class='footer'>&copy; 2026 Hotel Booking Application. All rights reserved.</div>" +
               "</div></body></html>";
    }
}
