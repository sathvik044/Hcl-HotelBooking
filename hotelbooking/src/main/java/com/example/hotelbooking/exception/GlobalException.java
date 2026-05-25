package com.example.hotelbooking.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalException {
    
    @ExceptionHandler(RoomNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> handleRoomNotFoundException(
        RoomNotFoundException ex, 
        WebRequest request) {
        
        log.error("Room not found exception: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage())
            .errorCode("ROOM_NOT_FOUND")
            .status(HttpStatus.NOT_FOUND.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(HotelNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> handleHotelNotFoundException(
        HotelNotFoundException ex, 
        WebRequest request) {
        
        log.error("Hotel not found exception: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage())
            .errorCode("HOTEL_NOT_FOUND")
            .status(HttpStatus.NOT_FOUND.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> handleUserNotFoundException(
        UserNotFoundException ex, 
        WebRequest request) {
        
        log.error("User not found exception: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage())
            .errorCode("USER_NOT_FOUND")
            .status(HttpStatus.NOT_FOUND.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(BookingNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<ErrorResponse> handleBookingNotFoundException(
        BookingNotFoundException ex, 
        WebRequest request) {
        
        log.error("Booking not found exception: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage())
            .errorCode("BOOKING_NOT_FOUND")
            .status(HttpStatus.NOT_FOUND.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(RoomUnavailableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleRoomUnavailableException(
        RoomUnavailableException ex, 
        WebRequest request) {
        
        log.error("Room unavailable exception: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage())
            .errorCode("ROOM_UNAVAILABLE")
            .status(HttpStatus.BAD_REQUEST.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(AuthException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ResponseEntity<ErrorResponse> handleAuthException(
        AuthException ex, 
        WebRequest request) {
        
        log.error("Authentication exception: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage())
            .errorCode("UNAUTHORIZED")
            .status(HttpStatus.UNAUTHORIZED.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleValidationException(
        MethodArgumentNotValidException ex, 
        WebRequest request) {
        
        String message = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        
        log.error("Validation exception: {}", message);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(message)
            .errorCode("VALIDATION_ERROR")
            .status(HttpStatus.BAD_REQUEST.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
        IllegalArgumentException ex, 
        WebRequest request) {
        
        log.error("Illegal argument exception: {}", ex.getMessage());
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage())
            .errorCode("INVALID_ARGUMENT")
            .status(HttpStatus.BAD_REQUEST.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
        Exception ex, 
        WebRequest request) {
        
        log.error("Unhandled global exception: ", ex);
        
        ErrorResponse errorResponse = ErrorResponse.builder()
            .message(ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred")
            .errorCode("INTERNAL_SERVER_ERROR")
            .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
            .timestamp(LocalDateTime.now())
            .path(request.getDescription(false).replace("uri=", ""))
            .build();
        
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
