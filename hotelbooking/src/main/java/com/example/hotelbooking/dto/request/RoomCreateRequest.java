package com.example.hotelbooking.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomCreateRequest {
    
    @NotNull(message = "Hotel ID is required")
    private Long hotelId;
    
    @NotBlank(message = "Room type is required")
    private String roomType;
    
    @NotNull(message = "Capacity is required")
    @Positive(message = "Capacity must be greater than 0")
    private Integer capacity;
    
    @NotNull(message = "Price per night is required")
    @Positive(message = "Price must be greater than 0")
    private BigDecimal pricePerNight;
    
    private String description;
    
    private String amenities;
    
    @NotNull(message = "Total rooms is required")
    @Positive(message = "Total rooms must be greater than 0")
    private Integer totalRooms;
}
