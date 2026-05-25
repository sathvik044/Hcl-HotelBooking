package com.example.hotelbooking.exception;

public class BookingNotFoundException extends RuntimeException {
    
    public BookingNotFoundException(String message) {
        super(message);
    }
    
    public BookingNotFoundException(Long bookingId) {
        super("Booking not found with id: " + bookingId);
    }
    
    public BookingNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
