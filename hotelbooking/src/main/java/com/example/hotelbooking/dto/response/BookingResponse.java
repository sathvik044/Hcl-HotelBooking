package com.example.hotelbooking.dto.response;

import com.example.hotelbooking.enums.BookingStatus;
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
public class BookingResponse {
    
    private Long id;
    
    private Long userId;
    
    private Long roomId;
    
    private Long hotelId;
    
    private LocalDate checkInDate;
    
    private LocalDate checkOutDate;
    
    private Integer numberOfRooms;
    
    private Integer numberOfGuests;
    
    private BigDecimal totalPrice;
    
    private BookingStatus status;
    
    private String specialRequests;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
