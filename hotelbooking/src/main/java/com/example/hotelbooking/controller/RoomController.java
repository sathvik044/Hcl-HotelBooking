package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.response.RoomResponse;
import com.example.hotelbooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Slf4j
public class RoomController {
    
    private final RoomService roomService;
    
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<RoomResponse>> getRoomsByHotelId(@PathVariable Long hotelId) {
        log.info("GET request to get rooms by hotelId: {}", hotelId);
        List<RoomResponse> response = roomService.getAllRoomsByHotelId(hotelId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long roomId) {
        log.info("GET request to get room by id: {}", roomId);
        RoomResponse response = roomService.getRoomById(roomId);
        return ResponseEntity.ok(response);
    }
}
