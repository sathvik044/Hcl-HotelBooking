package com.example.hotelbooking.repository;

import com.example.hotelbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByUserIdAndStatus(Long userId, Booking.BookingStatus status);
    
    List<Booking> findByRoomId(Long roomId);
    
    List<Booking> findByRoomIdAndStatus(Long roomId, Booking.BookingStatus status);
    
    List<Booking> findByHotelId(Long hotelId);
    
    List<Booking> findByHotelIdAndStatus(Long hotelId, Booking.BookingStatus status);
    
    List<Booking> findByRoomIdAndStatusAndCheckInDateGreaterThanEqualAndCheckOutDateLessThanEqual(
        Long roomId, 
        Booking.BookingStatus status, 
        LocalDate checkInDate, 
        LocalDate checkOutDate
    );
    
    boolean existsByRoomIdAndStatusAndCheckInDateLessThanAndCheckOutDateGreaterThan(
        Long roomId,
        Booking.BookingStatus status,
        LocalDate checkOutDate,
        LocalDate checkInDate
    );
}
