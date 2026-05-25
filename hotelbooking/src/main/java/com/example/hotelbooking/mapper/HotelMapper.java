package com.example.hotelbooking.mapper;

import com.example.hotelbooking.dto.request.HotelCreateRequest;
import com.example.hotelbooking.dto.request.HotelUpdateRequest;
import com.example.hotelbooking.dto.response.HotelResponse;
import com.example.hotelbooking.entity.Hotel;

public class HotelMapper {

    private HotelMapper() {
        // Utility class — prevent instantiation
    }

    public static HotelResponse toResponse(Hotel hotel) {
        return HotelResponse.builder()
                .id(hotel.getId())
                .name(hotel.getName())
                .description(hotel.getDescription())
                .location(hotel.getLocation())
                .address(hotel.getAddress())
                .city(hotel.getCity())
                .amenities(hotel.getAmenities())
                .rating(hotel.getRating())
                .build();
    }

    public static Hotel toEntity(HotelCreateRequest request) {
        return Hotel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .address(request.getAddress())
                .city(request.getCity())
                .amenities(request.getAmenities())
                .rating(request.getRating())
                .build();
    }

    public static void updateEntity(HotelUpdateRequest request, Hotel hotel) {
        java.util.Optional.ofNullable(request.getName()).ifPresent(hotel::setName);
        java.util.Optional.ofNullable(request.getDescription()).ifPresent(hotel::setDescription);
        java.util.Optional.ofNullable(request.getLocation()).ifPresent(hotel::setLocation);
        java.util.Optional.ofNullable(request.getAddress()).ifPresent(hotel::setAddress);
        java.util.Optional.ofNullable(request.getCity()).ifPresent(hotel::setCity);
        java.util.Optional.ofNullable(request.getAmenities()).ifPresent(hotel::setAmenities);
        java.util.Optional.ofNullable(request.getRating()).ifPresent(hotel::setRating);
    }
}
