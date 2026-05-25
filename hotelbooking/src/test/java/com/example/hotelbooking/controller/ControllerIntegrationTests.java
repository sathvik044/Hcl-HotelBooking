package com.example.hotelbooking.controller;

import com.example.hotelbooking.dto.request.*;
import com.example.hotelbooking.entity.User;
import com.example.hotelbooking.enums.RoomType;
import com.example.hotelbooking.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class ControllerIntegrationTests {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private UserRepository userRepository;

    @org.junit.jupiter.api.BeforeEach
    public void setup() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();
    }

    // Shared state across ordered tests
    private static String userToken;
    private static String adminToken;
    
    private static Long userId;
    private static Long hotelId;
    private static Long roomId;
    private static Long bookingId;

    @Test
    @Order(1)
    public void testUserRegistration() throws Exception {
        // Register standard user
        RegisterRequest userReg = RegisterRequest.builder()
                .username("john_doe")
                .email("john.doe@example.com")
                .password("password123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userReg)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.message").value("User registered successfully"))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        userToken = "Bearer " + objectMapper.readTree(response).get("token").asText();

        // Register admin user (name/email containing "admin" automatically sets ADMIN role in our AuthServiceImpl)
        RegisterRequest adminReg = RegisterRequest.builder()
                .username("system_admin")
                .email("admin@example.com")
                .password("adminpassword")
                .build();

        MvcResult adminResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminReg)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        String adminResponse = adminResult.getResponse().getContentAsString();
        adminToken = "Bearer " + objectMapper.readTree(adminResponse).get("token").asText();

        // Verify users are created in DB
        User dbUser = userRepository.findByEmail("john.doe@example.com").orElse(null);
        assertNotNull(dbUser);
        userId = dbUser.getId();
    }

    @Test
    @Order(2)
    public void testUserLogin() throws Exception {
        LoginRequest login = LoginRequest.builder()
                .username("john.doe@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.message").value("Login successful"));
    }

    @Test
    @Order(3)
    public void testGetMe() throws Exception {
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.name").value("john_doe"));
    }

    @Test
    @Order(4)
    public void testUpdateUser() throws Exception {
        UserUpdateRequest update = UserUpdateRequest.builder()
                .name("John Doe Updated")
                .build();

        mockMvc.perform(put("/api/users/" + userId)
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Doe Updated"));
    }

    @Test
    @Order(5)
    public void testAdminCreateHotel() throws Exception {
        HotelCreateRequest hotel = HotelCreateRequest.builder()
                .name("Grand Antigravity Resort")
                .description("A high-tech luxury resort with anti-gravity suites.")
                .location("Seattle, WA")
                .address("100 antigravity lane")
                .city("Seattle")
                .amenities("Wifi, Anti-gravity pool, VR Gaming Room")
                .rating(4.9)
                .build();

        MvcResult result = mockMvc.perform(post("/api/admin/hotels")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hotel)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Grand Antigravity Resort"))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        hotelId = objectMapper.readTree(response).get("id").asLong();
    }

    @Test
    @Order(6)
    public void testGetAllHotels() throws Exception {
        mockMvc.perform(get("/api/hotels")
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").value("Grand Antigravity Resort"));
    }

    @Test
    @Order(7)
    public void testGetHotelById() throws Exception {
        mockMvc.perform(get("/api/hotels/" + hotelId)
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(hotelId))
                .andExpect(jsonPath("$.name").value("Grand Antigravity Resort"));
    }

    @Test
    @Order(8)
    public void testSearchHotels() throws Exception {
        mockMvc.perform(get("/api/hotels/search")
                        .header("Authorization", userToken)
                        .param("location", "Seattle, WA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(9)
    public void testAdminUpdateHotel() throws Exception {
        HotelUpdateRequest update = HotelUpdateRequest.builder()
                .name("Grand Antigravity Resort & Spa")
                .rating(5.0)
                .build();

        mockMvc.perform(put("/api/admin/hotels/" + hotelId)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Grand Antigravity Resort & Spa"))
                .andExpect(jsonPath("$.rating").value(5.0));
    }

    @Test
    @Order(10)
    public void testAdminCreateRoom() throws Exception {
        RoomCreateRequest room = RoomCreateRequest.builder()
                .hotelId(hotelId)
                .roomType(RoomType.DELUXE.name())
                .capacity(2)
                .pricePerNight(new BigDecimal("199.99"))
                .description("Luxurious room with zero-G massage bed")
                .amenities("Zero-G bed, Mini-bar, Smart glass windows")
                .totalRooms(10)
                .build();

        MvcResult result = mockMvc.perform(post("/api/admin/rooms")
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(room)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.roomType").value(RoomType.DELUXE.name()))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        roomId = objectMapper.readTree(response).get("id").asLong();
    }

    @Test
    @Order(11)
    public void testGetRoomsByHotelId() throws Exception {
        mockMvc.perform(get("/api/rooms/hotel/" + hotelId)
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(roomId))
                .andExpect(jsonPath("$.hotelId").value(hotelId));
    }

    @Test
    @Order(12)
    public void testGetRoomById() throws Exception {
        mockMvc.perform(get("/api/rooms/" + roomId)
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(roomId))
                .andExpect(jsonPath("$.roomType").value(RoomType.DELUXE.name()));
    }

    @Test
    @Order(13)
    public void testAdminUpdateRoom() throws Exception {
        RoomUpdateRequest update = RoomUpdateRequest.builder()
                .description("Updated zerog room description")
                .pricePerNight(new BigDecimal("219.99"))
                .build();

        mockMvc.perform(put("/api/admin/rooms/" + roomId)
                        .header("Authorization", adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Updated zerog room description"))
                .andExpect(jsonPath("$.pricePerNight").value(219.99));
    }

    @Test
    @Order(14)
    public void testCreateBooking() throws Exception {
        String bookingJson = String.format(
                "{\"userId\":%d,\"hotelId\":%d,\"roomId\":%d,\"checkInDate\":\"%s\",\"checkOutDate\":\"%s\",\"numberOfRooms\":1,\"numberOfGuests\":2,\"specialRequests\":\"High floor, quiet suite\"}",
                userId, hotelId, roomId, LocalDate.now().plusDays(1), LocalDate.now().plusDays(5)
        );

        MvcResult result = mockMvc.perform(post("/api/bookings")
                        .header("Authorization", userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookingJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.userId").value(userId))
                .andExpect(jsonPath("$.totalPrice").exists())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        bookingId = objectMapper.readTree(response).get("id").asLong();
    }

    @Test
    @Order(15)
    public void testGetBookingsByUserId() throws Exception {
        mockMvc.perform(get("/api/bookings/user/" + userId)
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(bookingId));
    }

    @Test
    @Order(16)
    public void testGetBookingHistory() throws Exception {
        mockMvc.perform(get("/api/bookings/history/" + userId)
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(bookingId));
    }

    @Test
    @Order(17)
    public void testCancelBooking() throws Exception {
        mockMvc.perform(put("/api/bookings/cancel/" + bookingId)
                        .header("Authorization", userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(bookingId))
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @Order(18)
    public void testAdminGetAllBookings() throws Exception {
        mockMvc.perform(get("/api/admin/bookings")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(bookingId));
    }

    @Test
    @Order(19)
    public void testAdminGetBookingById() throws Exception {
        mockMvc.perform(get("/api/admin/bookings/" + bookingId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(bookingId));
    }

    @Test
    @Order(20)
    public void testAdminCancelBookingAlreadyCancelled() throws Exception {
        mockMvc.perform(put("/api/admin/bookings/cancel/" + bookingId)
                        .header("Authorization", adminToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @Order(21)
    public void testAdminGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @Order(22)
    public void testAdminGetUserById() throws Exception {
        mockMvc.perform(get("/api/admin/users/" + userId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(userId));
    }

    @Test
    @Order(23)
    public void testAdminBlockUser() throws Exception {
        mockMvc.perform(put("/api/admin/users/block/" + userId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.blocked").value(true));
    }

    @Test
    @Order(24)
    public void testAdminUnblockUser() throws Exception {
        mockMvc.perform(put("/api/admin/users/unblock/" + userId)
                        .header("Authorization", adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.blocked").value(false));
    }

    @Test
    @Order(25)
    public void testAdminDeleteRoom() throws Exception {
        mockMvc.perform(delete("/api/admin/rooms/" + roomId)
                        .header("Authorization", adminToken))
                .andExpect(status().isNoContent());
    }

    @Test
    @Order(26)
    public void testAdminDeleteHotel() throws Exception {
        mockMvc.perform(delete("/api/admin/hotels/" + hotelId)
                        .header("Authorization", adminToken))
                .andExpect(status().isNoContent());
    }
}
