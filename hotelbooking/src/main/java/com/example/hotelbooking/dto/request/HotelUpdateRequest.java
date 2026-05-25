package com.example.hotelbooking.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HotelUpdateRequest {

    private String name;

    private String description;

    private String location;

    private String address;

    private String city;

    private String amenities;

    private Double rating;

    private String image;
}
