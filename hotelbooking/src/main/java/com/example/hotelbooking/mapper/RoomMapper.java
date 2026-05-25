package com.example.hotelbooking.mapper;

import com.example.hotelbooking.dto.request.RoomCreateRequest;
import com.example.hotelbooking.dto.response.RoomResponse;
import com.example.hotelbooking.entity.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {
    
    public RoomResponse toResponse(Room room) {
        if (room == null) {
            return null;
        }
        
        return RoomResponse.builder()
            .id(room.getId())
            .hotelId(room.getHotelId())
            .roomType(room.getRoomType())
            .capacity(room.getCapacity())
            .pricePerNight(room.getPricePerNight())
            .description(room.getDescription())
            .amenities(room.getAmenities())
            .totalRooms(room.getTotalRooms())
            .availableRooms(room.getAvailableRooms())
            .isActive(room.getIsActive())
            .createdAt(room.getCreatedAt())
            .updatedAt(room.getUpdatedAt())
            .build();
    }
    
    public Room toEntity(RoomCreateRequest request) {
        if (request == null) {
            return null;
        }
        
        return Room.builder()
            .hotelId(request.getHotelId())
            .roomType(request.getRoomType())
            .capacity(request.getCapacity())
            .pricePerNight(request.getPricePerNight())
            .description(request.getDescription())
            .amenities(request.getAmenities())
            .totalRooms(request.getTotalRooms())
            .availableRooms(request.getTotalRooms())
            .isActive(true)
            .build();
    }
}
