package com.example.hotelbooking.service.email;

import com.example.hotelbooking.dto.email.EmailDTO;
import com.example.hotelbooking.email.EmailTemplateUtil;
import com.example.hotelbooking.exception.EmailSendingException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(EmailDTO emailDTO) {
        log.info("Attempting to send email to: {} with subject: {}", emailDTO.getTo(), emailDTO.getSubject());
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(emailDTO.getTo());
            helper.setSubject(emailDTO.getSubject());
            helper.setText(emailDTO.getBody(), true); // Send as HTML

            mailSender.send(message);
            log.info("Email sent successfully to: {}", emailDTO.getTo());
        } catch (MessagingException e) {
            log.error("Failed to construct or send mail to: {}. Error: {}", emailDTO.getTo(), e.getMessage(), e);
            throw new EmailSendingException("Failed to send email to " + emailDTO.getTo() + ": " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error occurred while sending email to: {}. Error: {}", emailDTO.getTo(), e.getMessage(), e);
            throw new EmailSendingException("An unexpected error occurred while sending email to " + emailDTO.getTo() + ": " + e.getMessage(), e);
        }
    }

    @Override
    public void sendUserRegistrationEmail(String toEmail, String userName) {
        log.info("Generating registration email for: {}", toEmail);
        String body = EmailTemplateUtil.buildWelcomeEmail(userName);
        EmailDTO emailDTO = EmailDTO.builder()
                .to(toEmail)
                .subject("Welcome to Hotel Booking Application")
                .body(body)
                .build();
        sendEmail(emailDTO);
    }

    @Override
    public void sendBookingConfirmationEmail(String toEmail, String userName, String hotelName, String roomDetails, String checkIn, String checkOut) {
        log.info("Generating booking confirmation email for: {} at hotel: {}", toEmail, hotelName);
        String body = EmailTemplateUtil.buildBookingConfirmationEmail(userName, hotelName, roomDetails, checkIn, checkOut);
        EmailDTO emailDTO = EmailDTO.builder()
                .to(toEmail)
                .subject("Booking Confirmation")
                .body(body)
                .build();
        sendEmail(emailDTO);
    }

    @Override
    public void sendBookingCancellationEmail(String toEmail, String userName, String hotelDetails, String cancellationMessage) {
        log.info("Generating booking cancellation email for: {} for hotel reservation: {}", toEmail, hotelDetails);
        String body = EmailTemplateUtil.buildBookingCancellationEmail(userName, hotelDetails, cancellationMessage);
        EmailDTO emailDTO = EmailDTO.builder()
                .to(toEmail)
                .subject("Booking Cancelled")
                .body(body)
                .build();
        sendEmail(emailDTO);
    }
}
