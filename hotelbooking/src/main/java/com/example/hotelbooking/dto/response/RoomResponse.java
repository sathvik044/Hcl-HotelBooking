package com.example.hotelbooking.dto.response;

import com.example.hotelbooking.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    
    private Long id;
    
    private Long hotelId;
    
    private RoomType roomType;
    
    private Integer capacity;
    
    private BigDecimal pricePerNight;
    
    private String description;
    
    private String amenities;
    
    private Integer totalRooms;
    
    private Integer availableRooms;
    
    private Boolean isActive;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
