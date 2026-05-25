package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.response.BookingResponse;
import com.example.hotelbooking.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@Slf4j
public class AdminBookingController {
    
    private final BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        log.info("GET request to get all bookings");
        List<BookingResponse> response = bookingService.getAllBookings();
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        log.info("GET request to get booking with id: {}", id);
        BookingResponse response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/cancel/{id}")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
        log.info("PUT request to cancel booking with id: {}", id);
        BookingResponse response = bookingService.cancelBooking(id);
        return ResponseEntity.ok(response);
    }
}
