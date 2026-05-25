package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.request.BookingCreateRequest;
import com.example.hotelbooking.dto.response.BookingResponse;
import com.example.hotelbooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingCreateRequest request) {
        log.info("POST request to create booking for userId: {}", request.getUserId());
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserId(@PathVariable Long userId) {
        log.info("GET request to get bookings for userId: {}", userId);
        List<BookingResponse> response = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingHistory(@PathVariable Long userId) {
        log.info("GET request to get booking history for userId: {}", userId);
        List<BookingResponse> response = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/cancel/{id}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        log.info("PUT request to cancel booking with id: {}", id);
        BookingResponse response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(response);
    }
}
