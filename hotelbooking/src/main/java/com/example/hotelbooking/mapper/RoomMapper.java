package com.example.hotelbooking.mapper;

import com.example.hotelbooking.dto.request.RoomCreateRequest;
import com.example.hotelbooking.dto.response.RoomResponse;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.enums.RoomType;
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
            .roomType(RoomType.valueOf(request.getRoomType().toUpperCase()))
            .capacity(request.getCapacity())
            .pricePerNight(request.getPricePerNight())
            .description(request.getDescription())
            .amenities(request.getAmenities())
            .totalRooms(request.getTotalRooms())
            .availableRooms(request.getTotalRooms())
            .isActive(true)
            .build();
    }

    public void updateEntity(com.example.hotelbooking.dto.request.RoomUpdateRequest request, Room room) {
        if (request == null || room == null) {
            return;
        }
        
        if (request.getRoomType() != null) {
            room.setRoomType(RoomType.valueOf(request.getRoomType().toUpperCase()));
        }
        if (request.getCapacity() != null) {
            room.setCapacity(request.getCapacity());
        }
        if (request.getPricePerNight() != null) {
            room.setPricePerNight(request.getPricePerNight());
        }
        if (request.getDescription() != null) {
            room.setDescription(request.getDescription());
        }
        if (request.getAmenities() != null) {
            room.setAmenities(request.getAmenities());
        }
        if (request.getTotalRooms() != null) {
            room.setTotalRooms(request.getTotalRooms());
        }
        if (request.getAvailableRooms() != null) {
            room.setAvailableRooms(request.getAvailableRooms());
        }
        if (request.getIsActive() != null) {
            room.setIsActive(request.getIsActive());
        }
    }
}
