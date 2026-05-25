package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.request.RoomCreateRequest;
import com.example.hotelbooking.dto.request.RoomUpdateRequest;
import com.example.hotelbooking.dto.response.RoomResponse;
import java.util.List;

public interface RoomService {
    
    RoomResponse getRoomsByHotelId(Long hotelId);
    
    List<RoomResponse> getAllRoomsByHotelId(Long hotelId);
    
    RoomResponse getRoomById(Long roomId);
    
    RoomResponse createRoom(RoomCreateRequest request);
    
    RoomResponse updateRoom(Long roomId, RoomUpdateRequest request);
    
    void deleteRoom(Long roomId);
    
    void updateAvailableRooms(Long roomId, Integer numberOfRooms, boolean decreaseCount);
}
