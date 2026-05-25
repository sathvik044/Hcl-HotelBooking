package com.example.hotelbooking.exception;

public class RoomUnavailableException extends RuntimeException {
    
    public RoomUnavailableException(String message) {
        super(message);
    }
    
    public RoomUnavailableException(Long roomId, int requestedRooms, int availableRooms) {
        super("Room with id: " + roomId + " is not available. Requested: " + requestedRooms + 
              ", Available: " + availableRooms);
    }
    
    public RoomUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
