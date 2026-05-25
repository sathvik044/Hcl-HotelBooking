package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:test-hotel-booking@gmail.com}")
    private String fromEmail;

    @Override
    public void sendWelcomeEmail(String toEmail, String userName) {
        log.info("Preparing to send welcome email to: {}", toEmail);
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to HCLStay!");
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #ffffff;'>"
                    + "<div style='text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px;'>"
                    + "<h1 style='color: #6366f1; margin: 0; font-size: 24px; font-weight: 800;'>HCL<span style='color: #4f46e5;'>Stay</span></h1>"
                    + "<p style='color: #6b7280; font-size: 14px; margin: 5px 0 0 0;'>Your Ultimate Escape Awaits</p>"
                    + "</div>"
                    + "<p>Dear <strong>" + userName + "</strong>,</p>"
                    + "<p>Thank you for registering with <strong>HCLStay</strong>! Your account has been successfully created and configured.</p>"
                    + "<p>Explore our premium collections of hotels and rooms all over the world, book dynamically, and manage your trips securely.</p>"
                    + "<div style='text-align: center; margin: 30px 0;'>"
                    + "<a href='http://localhost:5173' style='background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Start Exploring Now</a>"
                    + "</div>"
                    + "<p>If you have any questions or require assistance, feel free to reply to this email.</p>"
                    + "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;'>"
                    + "<p style='font-size: 0.8rem; color: #9ca3af; text-align: center;'>&copy; 2026 HCLStay Team. All rights reserved.</p>"
                    + "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully: Welcome email to {}", toEmail);
            
        } catch (MailAuthenticationException e) {
            log.error("Email sending failed: Authentication error while sending welcome email to {}. Details: {}", toEmail, e.getMessage());
        } catch (MessagingException e) {
            log.error("Email sending failed: Message construction error while sending welcome email to {}. Details: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Email sending failed: Unhandled exception while sending welcome email to {}. Details: {}", toEmail, e.getMessage());
        }
    }

    @Override
    public void sendBookingConfirmationEmail(String toEmail, String userName, String hotelName, 
                                             String roomType, String checkIn, String checkOut, Long bookingId) {
        log.info("Preparing to send booking confirmation email to: {} for bookingId: {}", toEmail, bookingId);
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Booking Confirmed - ID: #" + bookingId + " - HCLStay");
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #ffffff;'>"
                    + "<div style='text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px;'>"
                    + "<h1 style='color: #10b981; margin: 0; font-size: 24px; font-weight: 800;'>Booking Confirmed!</h1>"
                    + "<p style='color: #6b7280; font-size: 14px; margin: 5px 0 0 0;'>Booking Reference ID: #" + bookingId + "</p>"
                    + "</div>"
                    + "<p>Dear <strong>" + userName + "</strong>,</p>"
                    + "<p>Great news! Your booking has been successfully confirmed. Below are your reservation details:</p>"
                    + "<table style='width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 15px;'>"
                    + "<tr>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;'>Hotel Name:</td>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; text-align: right; color: #1f2937;'>" + hotelName + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;'>Room Type:</td>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; text-align: right; color: #1f2937;'>" + roomType + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;'>Check-in Date:</td>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; text-align: right; color: #1f2937;'>" + checkIn + "</td>"
                    + "</tr>"
                    + "<tr>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280;'>Check-out Date:</td>"
                    + "<td style='padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: bold; text-align: right; color: #1f2937;'>" + checkOut + "</td>"
                    + "</tr>"
                    + "</table>"
                    + "<p>We look forward to hosting you! You can view and manage your reservation details anytime on your dashboard.</p>"
                    + "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;'>"
                    + "<p style='font-size: 0.8rem; color: #9ca3af; text-align: center;'>&copy; 2026 HCLStay Team. All rights reserved.</p>"
                    + "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully: Booking confirmation to {} for bookingId: {}", toEmail, bookingId);
            
        } catch (MailAuthenticationException e) {
            log.error("Email sending failed: Authentication error while sending booking confirmation to {}. Details: {}", toEmail, e.getMessage());
        } catch (MessagingException e) {
            log.error("Email sending failed: Message construction error while sending booking confirmation to {}. Details: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Email sending failed: Unhandled exception while sending booking confirmation to {}. Details: {}", toEmail, e.getMessage());
        }
    }

    @Override
    public void sendCancellationEmail(String toEmail, String userName, Long bookingId, String hotelName) {
        log.info("Preparing to send cancellation email to: {} for bookingId: {}", toEmail, bookingId);
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Booking Cancelled - ID: #" + bookingId + " - HCLStay");
            
            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #ffffff;'>"
                    + "<div style='text-align: center; margin-bottom: 20px; border-bottom: 2px solid #f3f4f6; padding-bottom: 15px;'>"
                    + "<h1 style='color: #ef4444; margin: 0; font-size: 24px; font-weight: 800;'>Reservation Cancelled</h1>"
                    + "<p style='color: #6b7280; font-size: 14px; margin: 5px 0 0 0;'>Booking Reference ID: #" + bookingId + "</p>"
                    + "</div>"
                    + "<p>Dear <strong>" + userName + "</strong>,</p>"
                    + "<p>As requested, your reservation for <strong>" + hotelName + "</strong> (Booking ID: #" + bookingId + ") has been successfully cancelled.</p>"
                    + "<p>Any refund amount due based on the cancellation policy will be processed shortly to your original payment method.</p>"
                    + "<p>We hope to serve you again in the future!</p>"
                    + "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;'>"
                    + "<p style='font-size: 0.8rem; color: #9ca3af; text-align: center;'>&copy; 2026 HCLStay Team. All rights reserved.</p>"
                    + "</div>";
            
            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
            log.info("Email sent successfully: Booking cancellation to {} for bookingId: {}", toEmail, bookingId);
            
        } catch (MailAuthenticationException e) {
            log.error("Email sending failed: Authentication error while sending booking cancellation to {}. Details: {}", toEmail, e.getMessage());
        } catch (MessagingException e) {
            log.error("Email sending failed: Message construction error while sending booking cancellation to {}. Details: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            log.error("Email sending failed: Unhandled exception while sending booking cancellation to {}. Details: {}", toEmail, e.getMessage());
        }
    }
}
