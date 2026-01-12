package com.ferryapp.booking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RideSearchRequest {
    
    @NotNull(message = "Departure port ID is required")
    private Long departurePortId;
    
    @NotNull(message = "Arrival port ID is required")
    private Long arrivalPortId;
    
    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime;
    
    @NotNull(message = "Number of passengers is required")
    private Integer passengers;
}
