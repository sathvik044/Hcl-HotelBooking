package com.example.hotelbooking.service;

/**
 * Service interface for handling all email notification operations globally.
 */
public interface EmailService {
    
    /**
     * Sends a welcome HTML email to the user upon successful registration.
     * 
     * @param toEmail   Recipient's email address
     * @param userName  Recipient's full name
     */
    void sendWelcomeEmail(String toEmail, String userName);
    
    /**
     * Sends a detailed booking confirmation HTML email to the user.
     * 
     * @param toEmail    Recipient's email address
     * @param userName   Recipient's full name
     * @param hotelName  Name of the booked hotel
     * @param roomType   Room category description
     * @param checkIn    Check-in date formatted string
     * @param checkOut   Check-out date formatted string
     * @param bookingId  Unique reference booking identifier
     */
    void sendBookingConfirmationEmail(String toEmail, String userName, String hotelName, 
                                      String roomType, String checkIn, String checkOut, Long bookingId);
    
    /**
     * Sends a reservation cancellation confirmation HTML email to the user.
     * 
     * @param toEmail    Recipient's email address
     * @param userName   Recipient's full name
     * @param bookingId  Cancelled booking reference identifier
     * @param hotelName  Name of the cancelled hotel reservation
     */
    void sendCancellationEmail(String toEmail, String userName, Long bookingId, String hotelName);
}
