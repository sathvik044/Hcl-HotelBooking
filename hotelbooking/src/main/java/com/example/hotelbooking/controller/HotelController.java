package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.response.HotelResponse;
import com.example.hotelbooking.exception.HotelNotFoundException;
import com.example.hotelbooking.service.HotelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@Slf4j
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<List<HotelResponse>> getAllHotels() {
        log.info("GET /api/hotels invoked");
        List<HotelResponse> hotels = hotelService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelResponse> getHotelById(@PathVariable Long id) {
        log.info("GET /api/hotels/{} invoked", id);
        HotelResponse hotel = hotelService.getHotelById(id);
        return ResponseEntity.ok(hotel);
    }

    @GetMapping("/search")
    public ResponseEntity<List<HotelResponse>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String checkIn,
            @RequestParam(required = false) String checkOut,
            @RequestParam(required = false) Integer guests) {
        log.info("GET /api/hotels/search invoked. Location: {}, CheckIn: {}, CheckOut: {}, Guests: {}", 
                location, checkIn, checkOut, guests);
        List<HotelResponse> results = hotelService.searchHotels(location);
        return ResponseEntity.ok(results);
    }

    @ExceptionHandler(HotelNotFoundException.class)
    public ResponseEntity<String> handleHotelNotFound(HotelNotFoundException ex) {
        log.warn("HotelController Local ExceptionHandler caught: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
