package com.example.hotelbooking.dto.email;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailRequestDTO {

    /** Recipient email address */
    private String to;

    /** Display name of the recipient */
    private String userName;

    // ── Booking details (populated only for booking emails) ──────────────────

    private String hotelName;

    private String roomType;

    private String checkInDate;

    private String checkOutDate;

    private String bookingId;

    private String cancellationReason;
}
