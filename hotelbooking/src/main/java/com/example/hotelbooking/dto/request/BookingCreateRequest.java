package com.example.hotelbooking.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingCreateRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotNull(message = "Room ID is required")
    private Long roomId;
    
    @NotNull(message = "Hotel ID is required")
    private Long hotelId;
    
    @NotNull(message = "Check-in date is required")
    @FutureOrPresent(message = "Check-in date must be today or in the future")
    private LocalDate checkInDate;
    
    @NotNull(message = "Check-out date is required")
    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOutDate;
    
    @NotNull(message = "Number of rooms is required")
    @Positive(message = "Number of rooms must be greater than 0")
    private Integer numberOfRooms;
    
    @NotNull(message = "Number of guests is required")
    @Positive(message = "Number of guests must be greater than 0")
    private Integer numberOfGuests;
    
    private String specialRequests;
    
    @AssertTrue(message = "Check-out date must be after check-in date")
    public boolean isValidDateRange() {
        if (checkInDate != null && checkOutDate != null) {
            return checkOutDate.isAfter(checkInDate);
        }
        return true;
    }
}
