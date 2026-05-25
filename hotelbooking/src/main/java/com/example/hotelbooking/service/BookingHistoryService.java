package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.response.BookingHistoryResponse;
import java.util.List;

public interface BookingHistoryService {
    
    void recordBooking(Long bookingId, Long userId, Long roomId, Long hotelId);
    
    void recordCancellation(Long bookingId, Long userId);
    
    void recordCompletion(Long bookingId, Long userId);
    
    List<BookingHistoryResponse> getBookingHistory(Long userId);
    
    List<BookingHistoryResponse> getBookingHistoryByBookingId(Long bookingId);
}
