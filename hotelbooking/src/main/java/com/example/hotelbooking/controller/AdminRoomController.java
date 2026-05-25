package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.request.RoomCreateRequest;
import com.example.hotelbooking.dto.request.RoomUpdateRequest;
import com.example.hotelbooking.dto.response.RoomResponse;
import com.example.hotelbooking.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
@Slf4j
public class AdminRoomController {
    
    private final RoomService roomService;
    
    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomCreateRequest request) {
        log.info("POST request to create room for hotelId: {}", request.getHotelId());
        RoomResponse response = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/{roomId}")
    public ResponseEntity<RoomResponse> updateRoom(
        @PathVariable Long roomId,
        @Valid @RequestBody RoomUpdateRequest request) {
        log.info("PUT request to update room with id: {}", roomId);
        RoomResponse response = roomService.updateRoom(roomId, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long roomId) {
        log.info("DELETE request to delete room with id: {}", roomId);
        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
    }
}
