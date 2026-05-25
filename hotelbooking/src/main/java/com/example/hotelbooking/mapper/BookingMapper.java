package com.example.hotelbooking.mapper;

import com.example.hotelbooking.dto.request.BookingCreateRequest;
import com.example.hotelbooking.dto.response.BookingResponse;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.enums.BookingStatus;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {
    
    public BookingResponse toResponse(Booking booking) {
        if (booking == null) {
            return null;
        }
        
        return BookingResponse.builder()
            .id(booking.getId())
            .userId(booking.getUserId())
            .roomId(booking.getRoomId())
            .hotelId(booking.getHotelId())
            .checkInDate(booking.getCheckInDate())
            .checkOutDate(booking.getCheckOutDate())
            .numberOfRooms(booking.getNumberOfRooms())
            .numberOfGuests(booking.getNumberOfGuests())
            .totalPrice(booking.getTotalPrice())
            .status(booking.getStatus())
            .specialRequests(booking.getSpecialRequests())
            .createdAt(booking.getCreatedAt())
            .updatedAt(booking.getUpdatedAt())
            .build();
    }
    
    public Booking toEntity(BookingCreateRequest request) {
        if (request == null) {
            return null;
        }
        
        return Booking.builder()
            .userId(request.getUserId())
            .roomId(request.getRoomId())
            .hotelId(request.getHotelId())
            .checkInDate(request.getCheckInDate())
            .checkOutDate(request.getCheckOutDate())
            .numberOfRooms(request.getNumberOfRooms())
            .numberOfGuests(request.getNumberOfGuests())
            .specialRequests(request.getSpecialRequests())
            .status(BookingStatus.PENDING)
            .build();
    }
}
