package com.example.hotelbooking.mapper;

import com.example.hotelbooking.dto.response.BookingHistoryResponse;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.BookingHistory;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class BookingHistoryMapper {
    
    public BookingHistoryResponse toResponse(BookingHistory history) {
        if (history == null) {
            return null;
        }
        
        return BookingHistoryResponse.builder()
            .id(history.getId())
            .bookingId(history.getBookingId())
            .userId(history.getUserId())
            .roomId(history.getRoomId())
            .hotelId(history.getHotelId())
            .checkInDate(history.getCheckInDate())
            .checkOutDate(history.getCheckOutDate())
            .numberOfRooms(history.getNumberOfRooms())
            .numberOfGuests(history.getNumberOfGuests())
            .totalPrice(history.getTotalPrice())
            .status(history.getStatus().toString())
            .actionDate(history.getActionDate())
            .remarks(history.getRemarks())
            .createdAt(history.getCreatedAt())
            .build();
    }
    
    public BookingHistory toEntity(Booking booking, BookingHistory.HistoryStatus status, String remarks) {
        if (booking == null) {
            return null;
        }
        
        return BookingHistory.builder()
            .bookingId(booking.getId())
            .userId(booking.getUserId())
            .roomId(booking.getRoomId())
            .hotelId(booking.getHotelId())
            .checkInDate(booking.getCheckInDate())
            .checkOutDate(booking.getCheckOutDate())
            .numberOfRooms(booking.getNumberOfRooms())
            .numberOfGuests(booking.getNumberOfGuests())
            .totalPrice(booking.getTotalPrice())
            .status(status)
            .actionDate(LocalDateTime.now())
            .remarks(remarks)
            .build();
    }
}
