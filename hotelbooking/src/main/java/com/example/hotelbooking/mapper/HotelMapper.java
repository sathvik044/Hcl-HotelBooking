package com.example.hotelbooking.mapper;

import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.dto.response.HotelResponse;
import com.example.hotelbooking.dto.request.HotelCreateRequest;
import com.example.hotelbooking.dto.request.HotelUpdateRequest;

public class HotelMapper {

    public static HotelResponse toResponse(Hotel hotel) {
        if (hotel == null) {
            return null;
        }
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
        if (request == null) {
            return null;
        }
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
        if (request == null || hotel == null) {
            return;
        }
        if (request.getName() != null) {
            hotel.setName(request.getName());
        }
        if (request.getDescription() != null) {
            hotel.setDescription(request.getDescription());
        }
        if (request.getLocation() != null) {
            hotel.setLocation(request.getLocation());
        }
        if (request.getAddress() != null) {
            hotel.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            hotel.setCity(request.getCity());
        }
        if (request.getAmenities() != null) {
            hotel.setAmenities(request.getAmenities());
        }
        if (request.getRating() != null) {
            hotel.setRating(request.getRating());
        }
    }
}
