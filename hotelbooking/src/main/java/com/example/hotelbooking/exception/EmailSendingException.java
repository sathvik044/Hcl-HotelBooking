package com.example.hotelbooking.exception;

/**
 * Thrown when an email fails to send due to authentication,
 * messaging, or general SMTP errors.
 */
public class EmailSendingException extends RuntimeException {

    public EmailSendingException(String message) {
        super(message);
    }

    public EmailSendingException(String message, Throwable cause) {
        super(message, cause);
    }
}
