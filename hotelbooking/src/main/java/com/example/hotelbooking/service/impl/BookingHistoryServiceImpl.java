package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.response.BookingHistoryResponse;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.entity.BookingHistory;
import com.example.hotelbooking.repository.BookingHistoryRepository;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.service.BookingHistoryService;
import com.example.hotelbooking.mapper.BookingHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingHistoryServiceImpl implements BookingHistoryService {
    
    private final BookingHistoryRepository bookingHistoryRepository;
    private final BookingRepository bookingRepository;
    private final BookingHistoryMapper bookingHistoryMapper;
    
    @Override
    @Transactional
    public void recordBooking(Long bookingId, Long userId, Long roomId, Long hotelId) {
        log.info("Recording booking in history for bookingId: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElse(null);
        
        if (booking == null) {
            log.error("Booking not found with id: {}", bookingId);
            return;
        }
        
        BookingHistory history = bookingHistoryMapper.toEntity(
            booking, 
            BookingHistory.HistoryStatus.BOOKED, 
            "Booking confirmed"
        );
        
        bookingHistoryRepository.save(history);
        log.info("Booking recorded in history with id: {}", bookingId);
    }
    
    @Override
    @Transactional
    public void recordCancellation(Long bookingId, Long userId) {
        log.info("Recording cancellation in history for bookingId: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElse(null);
        
        if (booking == null) {
            log.error("Booking not found with id: {}", bookingId);
            return;
        }
        
        BookingHistory history = bookingHistoryMapper.toEntity(
            booking, 
            BookingHistory.HistoryStatus.CANCELLED, 
            "Booking cancelled"
        );
        
        bookingHistoryRepository.save(history);
        log.info("Cancellation recorded in history for bookingId: {}", bookingId);
    }
    
    @Override
    @Transactional
    public void recordCompletion(Long bookingId, Long userId) {
        log.info("Recording completion in history for bookingId: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElse(null);
        
        if (booking == null) {
            log.error("Booking not found with id: {}", bookingId);
            return;
        }
        
        BookingHistory history = bookingHistoryMapper.toEntity(
            booking, 
            BookingHistory.HistoryStatus.COMPLETED, 
            "Booking completed"
        );
        
        bookingHistoryRepository.save(history);
        log.info("Completion recorded in history for bookingId: {}", bookingId);
    }
    
    @Override
    public List<BookingHistoryResponse> getBookingHistory(Long userId) {
        log.info("Getting booking history for userId: {}", userId);
        
        return bookingHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(bookingHistoryMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingHistoryResponse> getBookingHistoryByBookingId(Long bookingId) {
        log.info("Getting booking history for bookingId: {}", bookingId);
        
        return bookingHistoryRepository.findByBookingId(bookingId)
            .stream()
            .map(bookingHistoryMapper::toResponse)
            .collect(Collectors.toList());
    }
}
