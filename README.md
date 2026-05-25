## Hotel Booking Application

## Project Overview

The Hotel Booking Application is a full-stack web application designed to help users search hotels, view room details, make bookings, and manage booking history in a secure and user-friendly environment.

The project follows a complete Java Full Stack architecture using Spring Boot for backend development and React for frontend development.

The system is built to support secure authentication, role-based authorization, booking management, admin operations, email notifications, exception handling, logging, and database integration.

# Tech Stack

# Frontend

- React
- Vite
- Axios
- React Router DOM
- CSS / Tailwind CSS

## Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT Authentication
- Maven

## Database

- H2 Database for development
- MySQL or PostgreSQL for production

## Tools

- Git
- GitHub / Bitbucket / GitLab
- Postman
- Maven

---

## System Architecture

This project follows a layered architecture:

- Controller Layer
- Service Layer
- Repository Layer
- Entity Layer
- DTO Layer
- Security Layer
- Configuration Layer
- Exception Layer

Request Flow:

`Client -> Controller -> Service -> Repository -> Database`

----

## APIs Used In Project

### Authentication APIs
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and get JWT token
- `POST /api/auth/logout` - Logout user

### User APIs
- `GET /api/users/me` - Get current logged-in user profile
- `PUT /api/users/{id}` - Update user profile

### Hotel APIs
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/{id}` - Get hotel by ID
- `GET /api/hotels/search?location=...&checkIn=...&checkOut=...&guests=...` - Search hotels

### Room APIs
- `GET /api/rooms/hotel/{hotelId}` - Get all rooms of a hotel
- `GET /api/rooms/{roomId}` - Get room by ID

### Booking APIs
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/user/{userId}` - Get bookings by user ID
- `GET /api/bookings/history/{userId}` - Get booking history
- `PUT /api/bookings/cancel/{id}` - Cancel a booking

### Admin User APIs
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/{id}` - Get user by ID
- `PUT /api/admin/users/block/{id}` - Block user
- `PUT /api/admin/users/unblock/{id}` - Unblock user

### Admin Hotel APIs
- `POST /api/admin/hotels` - Add hotel
- `PUT /api/admin/hotels/{id}` - Update hotel
- `DELETE /api/admin/hotels/{id}` - Delete hotel

### Admin Room APIs
- `POST /api/admin/rooms` - Add room
- `PUT /api/admin/rooms/{roomId}` - Update room
- `DELETE /api/admin/rooms/{roomId}` - Delete room

### Admin Booking APIs
- `GET /api/admin/bookings` - Get all bookings
- `GET /api/admin/bookings/{id}` - Get booking by ID
- `PUT /api/admin/bookings/cancel/{id}` - Cancel booking as admin

### Admin Dashboard API
- `GET /api/admin/dashboard` - Get dashboard statistics

### Email Test APIs
- `POST /api/email/test-welcome?email=...&name=...` - Send test welcome email
- `POST /api/email/test-confirmation?email=...&name=...` - Send test booking confirmation email

---

## Commands To Run The Project

### Backend
Clone the project:
```bash
git clone <repository-url>
Go to backend folder:

bash

cd Hcl-HotelBooking/hotelbooking
Build the backend:

bash

mvn clean install
Run the backend:

bash

mvn spring-boot:run

### Frontend
Go to frontend folder:

cd frontend
Install dependencies:

npm install
Run frontend:

npm run dev
