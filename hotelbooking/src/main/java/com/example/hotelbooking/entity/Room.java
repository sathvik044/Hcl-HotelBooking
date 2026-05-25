package com.example.hotelbooking.entity;

import com.example.hotelbooking.enums.RoomType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long hotelId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotelId", referencedColumnName = "id", insertable = false, updatable = false)
    private Hotel hotel;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RoomType roomType;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    private BigDecimal pricePerNight;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String amenities;
    
    @Column(nullable = false)
    private Integer totalRooms;
    
    @Column(nullable = false)
    private Integer availableRooms;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
