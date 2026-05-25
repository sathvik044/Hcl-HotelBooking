package com.example.hotelbooking.service;

import com.example.hotelbooking.dto.request.HotelCreateRequest;
import com.example.hotelbooking.dto.request.HotelUpdateRequest;
import com.example.hotelbooking.dto.response.HotelResponse;

import java.util.List;

public interface HotelService {

    List<HotelResponse> getAllHotels();

    HotelResponse getHotelById(Long id);

    List<HotelResponse> searchHotels(String query);

    HotelResponse createHotel(HotelCreateRequest request);

    HotelResponse updateHotel(Long id, HotelUpdateRequest request);

    void deleteHotel(Long id);
}
