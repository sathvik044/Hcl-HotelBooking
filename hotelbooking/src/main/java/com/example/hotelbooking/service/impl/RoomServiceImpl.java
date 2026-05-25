package com.example.hotelbooking.service.impl;

import com.example.hotelbooking.dto.request.RoomCreateRequest;
import com.example.hotelbooking.dto.request.RoomUpdateRequest;
import com.example.hotelbooking.dto.response.RoomResponse;
import com.example.hotelbooking.entity.Room;
import com.example.hotelbooking.enums.RoomType;
import com.example.hotelbooking.exception.RoomNotFoundException;
import com.example.hotelbooking.exception.RoomUnavailableException;
import com.example.hotelbooking.repository.RoomRepository;
import com.example.hotelbooking.service.RoomService;
import com.example.hotelbooking.mapper.RoomMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoomServiceImpl implements RoomService {
    
    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;
    
    @Override
    public RoomResponse getRoomsByHotelId(Long hotelId) {
        log.info("Getting active available room by hotelId: {}", hotelId);
        List<Room> rooms = roomRepository.findByHotelIdAndIsActiveTrue(hotelId).stream()
            .filter(room -> room.getAvailableRooms() > 0)
            .collect(Collectors.toList());
        if (rooms.isEmpty()) {
            log.warn("No active available rooms found for hotelId: {}", hotelId);
            throw new RoomNotFoundException("No active available rooms found for hotel: " + hotelId);
        }
        Room room = rooms.get(0);
        return roomMapper.toResponse(room);
    }
    
    @Override
    public List<RoomResponse> getAllRoomsByHotelId(Long hotelId) {
        log.info("Getting all active available rooms by hotelId: {}", hotelId);
        return roomRepository.findByHotelIdAndIsActiveTrue(hotelId)
            .stream()
            .filter(room -> room.getAvailableRooms() > 0)
            .map(roomMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    public RoomResponse getRoomById(Long roomId) {
        log.info("Getting room by id: {}", roomId);
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> {
                log.error("Room not found with id: {}", roomId);
                return new RoomNotFoundException(roomId);
            });
        
        if (!room.getIsActive()) {
            log.error("Room is inactive with id: {}", roomId);
            throw new RoomNotFoundException("Room is not active: " + roomId);
        }
        return roomMapper.toResponse(room);
    }
    
    @Override
    @Transactional
    public RoomResponse createRoom(RoomCreateRequest request) {
        log.info("Creating new room for hotelId: {}", request.getHotelId());
        
        Room room = roomMapper.toEntity(request);
        
        Room savedRoom = roomRepository.save(room);
        log.info("Room created with id: {}", savedRoom.getId());
        return roomMapper.toResponse(savedRoom);
    }
    
    @Override
    @Transactional
    public RoomResponse updateRoom(Long roomId, RoomUpdateRequest request) {
        log.info("Updating room with id: {}", roomId);
        
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> {
                log.error("Room not found with id: {}", roomId);
                return new RoomNotFoundException(roomId);
            });
        
        roomMapper.updateEntity(request, room);
        
        Room updatedRoom = roomRepository.save(room);
        log.info("Room updated with id: {}", updatedRoom.getId());
        return roomMapper.toResponse(updatedRoom);
    }
    
    @Override
    @Transactional
    public void deleteRoom(Long roomId) {
        log.info("Deleting room with id: {}", roomId);
        
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> {
                log.error("Room not found with id: {}", roomId);
                return new RoomNotFoundException(roomId);
            });
        
        room.setIsActive(false);
        roomRepository.save(room);
        log.info("Room marked as inactive with id: {}", roomId);
    }
    
    @Override
    @Transactional
    public void updateAvailableRooms(Long roomId, Integer numberOfRooms, boolean decreaseCount) {
        log.info("Updating available rooms for roomId: {} by {}", roomId, numberOfRooms);
        
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> {
                log.error("Room not found with id: {}", roomId);
                return new RoomNotFoundException(roomId);
            });
        
        int currentAvailable = room.getAvailableRooms();
        
        if (decreaseCount) {
            if (currentAvailable < numberOfRooms) {
                log.error("Insufficient rooms available. Requested: {}, Available: {}", numberOfRooms, currentAvailable);
                throw new RoomUnavailableException(roomId, numberOfRooms, currentAvailable);
            }
            room.setAvailableRooms(currentAvailable - numberOfRooms);
        } else {
            room.setAvailableRooms(currentAvailable + numberOfRooms);
        }
        
        roomRepository.save(room);
        log.info("Available rooms updated for roomId: {}", roomId);
    }
}
