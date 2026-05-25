package com.example.hotelbooking.repository;

import com.example.hotelbooking.entity.BookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingHistoryRepository extends JpaRepository<BookingHistory, Long> {
    
    List<BookingHistory> findByUserId(Long userId);
    
    List<BookingHistory> findByBookingId(Long bookingId);
    
    List<BookingHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<BookingHistory> findByUserIdAndStatus(Long userId, BookingHistory.HistoryStatus status);
}
