package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.request.HotelCreateRequest;
import com.example.hotelbooking.dto.request.HotelUpdateRequest;
import com.example.hotelbooking.dto.response.HotelResponse;
import com.example.hotelbooking.entity.Hotel;
import com.example.hotelbooking.exception.HotelNotFoundException;
import com.example.hotelbooking.mapper.HotelMapper;
import com.example.hotelbooking.repository.HotelRepository;
import com.example.hotelbooking.service.HotelService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HotelServiceImpl implements HotelService {

    private final HotelRepository hotelRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HotelResponse> getAllHotels() {
        log.info("Fetching all hotels from the database");
        return hotelRepository.findAll().stream()
                .map(HotelMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public HotelResponse getHotelById(Long id) {
        log.info("Retrieving hotel with ID: {}", id);
        return hotelRepository.findById(id)
                .map(HotelMapper::toResponse)
                .orElseThrow(() -> new HotelNotFoundException("Hotel with ID " + id + " not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HotelResponse> searchHotels(String query) {
        log.info("Searching hotels with query: '{}'", query);
        List<Hotel> results = StringUtils.hasText(query)
                ? hotelRepository.searchHotels(query)
                : hotelRepository.findAll();
        return results.stream()
                .map(HotelMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HotelResponse createHotel(HotelCreateRequest request) {
        log.info("Creating a new hotel: {}", request.getName());
        Hotel savedHotel = hotelRepository.save(HotelMapper.toEntity(request));
        log.info("Successfully created hotel '{}' with ID: {}", savedHotel.getName(), savedHotel.getId());
        return HotelMapper.toResponse(savedHotel);
    }

    @Override
    public HotelResponse updateHotel(Long id, HotelUpdateRequest request) {
        log.info("Updating hotel with ID: {}", id);
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new HotelNotFoundException("Hotel with ID " + id + " not found"));
        HotelMapper.updateEntity(request, hotel);
        Hotel updatedHotel = hotelRepository.save(hotel);
        log.info("Successfully updated hotel with ID: {}", updatedHotel.getId());
        return HotelMapper.toResponse(updatedHotel);
    }

    @Override
    public void deleteHotel(Long id) {
        log.info("Deleting hotel with ID: {}", id);
        Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new HotelNotFoundException("Hotel with ID " + id + " not found"));
        hotelRepository.delete(hotel);
        log.info("Successfully deleted hotel with ID: {}", id);
    }
}
