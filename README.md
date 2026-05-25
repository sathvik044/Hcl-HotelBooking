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

---

## Project Structure

```text
src/main/java/com/example/hotelbooking/

controller/
service/
repository/
entity/
dto/
security/
config/
exception/
mapper/

Frontend structure:
src/

components/
pages/
services/
routes/
context/
assets/
styles/
Functional Requirements
Search hotels based on location, date, and availability
View hotel details, room types, pricing, and amenities
Book hotel rooms
Cancel existing bookings
Display booking confirmation
Display booking history
User Management and Security
User Sign Up
User Sign In
User Sign Out
Authentication using JWT
Authorization using Spring Security
Role-based access control
Secure access to APIs and protected features
Roles used in the application:

ROLE_USER
ROLE_ADMIN
Exception Handling
The application includes a global exception handling mechanism to ensure graceful error management.

Handled scenarios include:

Invalid input data
Validation failures
Booking not found
Hotel not found
Room not available
Unauthorized access
Runtime exceptions
Mail sending failures
The backend returns meaningful error responses, and the frontend displays user-friendly alerts/messages.

Logging
The application includes logging for monitoring and debugging.

Logging covers:

User actions
Authentication events
Booking operations
API requests and responses
Email notification events
Validation and runtime errors
System exceptions
Logging is implemented using SLF4J with Spring Boot logging support.

Database Connectivity
The application supports relational database integration.

Key points:

Proper schema design for users, hotels, rooms, and bookings
CRUD operations for core modules
Externalized configuration using application.properties
Development support using H2 database
Production-ready support for MySQL or PostgreSQL
Database Schema
Users
id
name
email
password
role
blocked
created_at
updated_at
Hotels
id
name
location
description
amenities
created_at
updated_at
Rooms
id
hotel_id
room_type
price_per_night
capacity
available_rooms
is_active
created_at
updated_at
Bookings
id
user_id
hotel_id
room_id
check_in_date
check_out_date
number_of_rooms
number_of_guests
total_price
status
special_requests
created_at
updated_at
Booking History
id
booking_id
user_id
action
action_time
API Development
The backend follows RESTful API design principles.

API responsibilities include:

Authentication APIs
User APIs
Hotel APIs
Room APIs
Booking APIs
Admin APIs
Email test/integration APIs if enabled
Design principles used:

Clear endpoint naming
Separation of frontend and backend
Reusable services
DTO-based request/response handling
Validation support
Standard HTTP status codes
Email Notification Module
The application supports email notifications for major user events.

Notifications include:

User registration confirmation
Booking confirmation
Booking cancellation notification
Implementation uses:

spring-boot-starter-mail
JavaMailSender
SimpleMailMessage
MimeMessage
MimeMessageHelper
Example SMTP configuration:

properties

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
Note:
Use a Gmail App Password instead of your normal Gmail password.

UI Design Requirements
The frontend is designed to be:

Responsive
User-friendly
Clean and consistent
Easy to navigate
UI expectations include:

Form validation
Alert messages
Booking status messages
Error display
Dashboard views for admin
Smooth user experience across desktop and mobile
Setup Instructions
Backend Setup
Clone the repository
bash

git clone <repository-url>
Navigate to backend project
bash

cd hotelbooking
Configure database and mail properties in application.properties

Build the project

bash

mvn clean install
Run the Spring Boot application
bash

mvn spring-boot:run
Frontend Setup
Navigate to frontend folder
bash

cd frontend
Install dependencies
bash

npm install
Start the frontend
bash

npm run dev
Configuration
Common backend configuration includes:

Database URL
Database username
Database password
JWT secret
JWT expiration
Mail username
Mail password
Example environment variables:

env

MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
Source Code Management
Source code must be maintained in a version-controlled repository.

Requirements:

Code must be pushed to GitHub, Bitbucket, or GitLab
Each team member should commit code individually
Proper commit history should be maintained
Repository should contain README and setup instructions
Recommended branch strategy:

main
develop
feature branches for each module
Deliverables
Working Hotel Booking Application
Source code repository link
README documentation
Setup instructions
Database schema
API implementation
Frontend UI
Authentication and authorization
Email notification module
Logging and exception handling
Best Practices Followed
Layered architecture
DTO-based request and response handling
Repository abstraction using Spring Data JPA
Secure authentication using JWT
Role-based authorization
Global exception handling
Reusable service layer
Externalized configuration
Clean code structure
Logging for debugging and monitoring
Future Enhancements
Payment gateway integration
Hotel image upload
Advanced filtering and sorting
Pagination support
Reviews and ratings
Booking invoice generation
Docker deployment
CI/CD pipeline integration
Cloud deployment
Conclusion
The Hotel Booking Application demonstrates a complete full-stack implementation of a real-world booking platform. It combines secure authentication, structured backend architecture, responsive frontend design, email notifications, exception handling, logging, and proper database management into one integrated solution.
