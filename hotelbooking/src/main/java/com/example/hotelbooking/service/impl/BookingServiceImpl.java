package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.request.BookingCreateRequest;
import com.example.hotelbooking.dto.response.BookingResponse;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.exception.BookingNotFoundException;
import com.example.hotelbooking.exception.RoomUnavailableException;
import com.example.hotelbooking.repository.BookingRepository;
import com.example.hotelbooking.service.BookingHistoryService;
import com.example.hotelbooking.service.BookingService;
import com.example.hotelbooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import com.example.hotelbooking.enums.BookingStatus;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {
    
    private final BookingRepository bookingRepository;
    private final RoomService roomService;
    private final BookingHistoryService bookingHistoryService;
    
    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request) {
        log.info("Creating booking for userId: {}, roomId: {}", request.getUserId(), request.getRoomId());
        
        // Check room availability
        boolean isAvailable = !bookingRepository.existsByRoomIdAndStatusAndCheckInDateLessThanAndCheckOutDateGreaterThan(
            request.getRoomId(),
            BookingStatus.CONFIRMED,
            request.getCheckOutDate(),
            request.getCheckInDate()
        );
        
        if (!isAvailable) {
            log.error("Room {} is not available for the requested dates", request.getRoomId());
            throw new RoomUnavailableException("Room is not available for the selected dates");
        }
        
        // Calculate total price
        long days = java.time.temporal.ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        BigDecimal pricePerNight = roomService.getRoomById(request.getRoomId()).getPricePerNight();
        BigDecimal totalPrice = pricePerNight.multiply(BigDecimal.valueOf(days * request.getNumberOfRooms()));
        
        // Create booking
        Booking booking = Booking.builder()
            .userId(request.getUserId())
            .roomId(request.getRoomId())
            .hotelId(request.getHotelId())
            .checkInDate(request.getCheckInDate())
            .checkOutDate(request.getCheckOutDate())
            .numberOfRooms(request.getNumberOfRooms())
            .numberOfGuests(request.getNumberOfGuests())
            .totalPrice(totalPrice)
            .status(BookingStatus.CONFIRMED)
            .specialRequests(request.getSpecialRequests())
            .build();
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update room availability
        roomService.updateAvailableRooms(request.getRoomId(), request.getNumberOfRooms(), true);
        
        // Record in booking history
        bookingHistoryService.recordBooking(
            savedBooking.getId(),
            request.getUserId(),
            request.getRoomId(),
            request.getHotelId()
        );
        
        log.info("Booking created with id: {}", savedBooking.getId());
        return mapToResponse(savedBooking);
    }
    
    @Override
    public BookingResponse getBookingById(Long bookingId) {
        log.info("Getting booking by id: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> {
                log.error("Booking not found with id: {}", bookingId);
                return new BookingNotFoundException(bookingId);
            });
        
        return mapToResponse(booking);
    }
    
    @Override
    public List<BookingResponse> getBookingsByUserId(Long userId) {
        log.info("Getting bookings for userId: {}", userId);
        
        return bookingRepository.findByUserId(userId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingResponse> getAllBookings() {
        log.info("Getting all bookings");
        
        return bookingRepository.findAll()
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<BookingResponse> getBookingsByHotelId(Long hotelId) {
        log.info("Getting bookings for hotelId: {}", hotelId);
        
        return bookingRepository.findByHotelId(hotelId)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        log.info("Cancelling booking with id: {}", bookingId);
        
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> {
                log.error("Booking not found with id: {}", bookingId);
                return new BookingNotFoundException(bookingId);
            });
        
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            log.error("Booking is already cancelled with id: {}", bookingId);
            throw new BookingNotFoundException("Booking is already cancelled: " + bookingId);
        }
        
        // Update booking status
        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        
        // Update room availability
        roomService.updateAvailableRooms(booking.getRoomId(), booking.getNumberOfRooms(), false);
        
        // Record cancellation in history
        bookingHistoryService.recordCancellation(bookingId, booking.getUserId());
        
        log.info("Booking cancelled with id: {}", bookingId);
        return mapToResponse(updatedBooking);
    }
    
    private BookingResponse mapToResponse(Booking booking) {
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
}
