package com.example.hotelbooking.repository;

import com.example.hotelbooking.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    List<Room> findByHotelIdAndIsActiveTrue(Long hotelId);
    
    List<Room> findByHotelId(Long hotelId);
    
    Optional<Room> findByIdAndIsActiveTrue(Long id);
    
    List<Room> findByRoomTypeAndHotelIdAndIsActiveTrue(String roomType, Long hotelId);
    
    boolean existsByIdAndHotelId(Long roomId, Long hotelId);
}
