package com.example.hotelbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingHistoryResponse {
    
    private Long id;
    
    private Long bookingId;
    
    private Long userId;
    
    private Long roomId;
    
    private Long hotelId;
    
    private LocalDate checkInDate;
    
    private LocalDate checkOutDate;
    
    private Integer numberOfRooms;
    
    private Integer numberOfGuests;
    
    private BigDecimal totalPrice;
    
    private String status;
    
    private LocalDateTime actionDate;
    
    private String remarks;
    
    private LocalDateTime createdAt;
}
