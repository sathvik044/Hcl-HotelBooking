package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.request.BookingCreateRequest;
import com.example.hotelbooking.dto.response.BookingResponse;
import java.util.List;

public interface BookingService {
    
    BookingResponse createBooking(BookingCreateRequest request);
    
    BookingResponse getBookingById(Long bookingId);
    
    List<BookingResponse> getBookingsByUserId(Long userId);
    
    List<BookingResponse> getAllBookings();
    
    List<BookingResponse> getBookingsByHotelId(Long hotelId);
    
    BookingResponse cancelBooking(Long bookingId);
}
