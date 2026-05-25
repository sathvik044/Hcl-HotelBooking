package com.example.hotelbooking.repository;

import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);
    
    List<Booking> findByRoomId(Long roomId);
    
    List<Booking> findByRoomIdAndStatus(Long roomId, BookingStatus status);
    
    List<Booking> findByHotelId(Long hotelId);
    
    List<Booking> findByHotelIdAndStatus(Long hotelId, BookingStatus status);
    
    List<Booking> findByRoomIdAndStatusAndCheckInDateGreaterThanEqualAndCheckOutDateLessThanEqual(
        Long roomId, 
        BookingStatus status, 
        LocalDate checkInDate, 
        LocalDate checkOutDate
    );
    
    boolean existsByRoomIdAndStatusAndCheckInDateLessThanAndCheckOutDateGreaterThan(
        Long roomId,
        BookingStatus status,
        LocalDate checkOutDate,
        LocalDate checkInDate
    );
}
