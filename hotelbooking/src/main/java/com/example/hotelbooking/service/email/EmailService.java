package com.example.hotelbooking.service.email;

import com.example.hotelbooking.dto.email.EmailDTO;

public interface EmailService {
    
    void sendEmail(EmailDTO emailDTO);
    
    void sendUserRegistrationEmail(String toEmail, String userName);
    
    void sendBookingConfirmationEmail(String toEmail, String userName, String hotelName, String roomDetails, String checkIn, String checkOut);
    
    void sendBookingCancellationEmail(String toEmail, String userName, String hotelDetails, String cancellationMessage);
}
