package com.ferryapp.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private LocalDateTime bookingDate;
    private String customerName;
    private String departurePort;
    private String arrivalPort;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private String shipName;
    private String cabinNumber;
    private Integer numberOfPassengers;
    private Double totalPrice;
    private String status;
    private String qrCodeBase64;
    private WeatherInfo weatherInfo;
    private ShipPosition shipPosition;
}
