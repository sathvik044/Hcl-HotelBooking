package com.example.hotelbooking.controller;

import com.example.hotelbooking.repository.*;
import com.example.hotelbooking.entity.Booking;
import com.example.hotelbooking.enums.BookingStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Slf4j
public class AdminDashboardController {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        log.info("GET /api/admin/dashboard invoked by admin");

        // 1. Calculate total revenue from confirmed bookings
        List<Booking> confirmedBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.CONFIRMED)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = confirmedBookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Counts
        long totalUsers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == com.example.hotelbooking.enums.UserRole.USER)
                .count();

        long totalHotels = hotelRepository.count();
        long totalBookings = bookingRepository.count();

        long activeRoomsCount = roomRepository.findAll().stream()
                .filter(r -> r.getIsActive() != null && r.getIsActive())
                .count();

        long blockedUsersCount = userRepository.findAll().stream()
                .filter(u -> u.isBlocked())
                .count();

        // 3. Daily stats for visual graphs
        Map<LocalDate, BigDecimal> revenueByDay = new TreeMap<>();
        for (Booking booking : confirmedBookings) {
            if (booking.getCreatedAt() != null) {
                LocalDate date = booking.getCreatedAt().toLocalDate();
                revenueByDay.put(date, revenueByDay.getOrDefault(date, BigDecimal.ZERO).add(booking.getTotalPrice()));
            }
        }

        List<Map<String, Object>> dailyStats = new ArrayList<>();
        for (Map.Entry<LocalDate, BigDecimal> entry : revenueByDay.entrySet()) {
            Map<String, Object> stat = new HashMap<>();
            stat.put("date", entry.getKey().toString());
            stat.put("revenue", entry.getValue());
            dailyStats.add(stat);
        }

        // Limit to last 7 days
        if (dailyStats.size() > 7) {
            dailyStats = new ArrayList<>(dailyStats.subList(dailyStats.size() - 7, dailyStats.size()));
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalUsers", totalUsers);
        stats.put("totalHotels", totalHotels);
        stats.put("totalBookings", totalBookings);
        stats.put("activeRoomsCount", activeRoomsCount);
        stats.put("blockedUsersCount", blockedUsersCount);
        stats.put("dailyStats", dailyStats);

        return ResponseEntity.ok(stats);
    }
}
