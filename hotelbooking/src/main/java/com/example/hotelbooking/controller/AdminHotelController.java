package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.request.HotelCreateRequest;
import com.example.hotelbooking.dto.request.HotelUpdateRequest;
import com.example.hotelbooking.dto.response.HotelResponse;
import com.example.hotelbooking.exception.HotelNotFoundException;
import com.example.hotelbooking.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/hotels")
@RequiredArgsConstructor
@Slf4j
public class AdminHotelController {

    private final HotelService hotelService;

    @PostMapping
    public ResponseEntity<HotelResponse> createHotel(@Valid @RequestBody HotelCreateRequest request) {
        log.info("POST /api/admin/hotels invoked by admin to create hotel '{}'", request.getName());
        HotelResponse response = hotelService.createHotel(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelResponse> updateHotel(
            @PathVariable Long id,
            @Valid @RequestBody HotelUpdateRequest request) {
        log.info("PUT /api/admin/hotels/{} invoked by admin to update hotel", id);
        HotelResponse response = hotelService.updateHotel(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
        log.info("DELETE /api/admin/hotels/{} invoked by admin", id);
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(HotelNotFoundException.class)
    public ResponseEntity<String> handleHotelNotFound(HotelNotFoundException ex) {
        log.warn("AdminHotelController Local ExceptionHandler caught: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
