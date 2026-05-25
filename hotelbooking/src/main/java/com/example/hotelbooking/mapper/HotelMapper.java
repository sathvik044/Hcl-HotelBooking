package com.example.hotelbooking.mapper;

import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.dto.response.HotelResponse;
import com.example.hotelbooking.dto.request.HotelCreateRequest;
import com.example.hotelbooking.dto.request.HotelUpdateRequest;
import org.springframework.stereotype.Component;

@Component
public class HotelMapper {

    public HotelResponse toResponse(Hotel hotel) {
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
                .image(hotel.getImage() != null ? hotel.getImage() : "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80")
                .build();
    }

    public Hotel toEntity(HotelCreateRequest request) {
        if (request == null) {
            return null;
        }
        String requestImage = request.getImage();
        if (requestImage == null || requestImage.trim().isEmpty()) {
            requestImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";
        }
        return Hotel.builder()
                .name(request.getName())
                .description(request.getDescription())
                .location(request.getLocation())
                .address(request.getAddress())
                .city(request.getCity())
                .amenities(request.getAmenities())
                .rating(request.getRating())
                .image(requestImage)
                .build();
    }

    public void updateEntity(HotelUpdateRequest request, Hotel hotel) {
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
        if (request.getImage() != null) {
            hotel.setImage(request.getImage());
        }
    }
}
