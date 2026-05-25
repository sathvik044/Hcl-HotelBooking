package com.example.hotelbooking.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomUpdateRequest {
    
    private String roomType;
    
    private Integer capacity;
    
    private BigDecimal pricePerNight;
    
    private String description;
    
    private String amenities;
    
    private Integer totalRooms;
    
    private Integer availableRooms;
    
    private Boolean isActive;
}
