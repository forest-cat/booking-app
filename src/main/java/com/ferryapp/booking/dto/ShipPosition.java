package com.ferryapp.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShipPosition {
    private Double latitude;
    private Double longitude;
    private String status;
    private Double speed;
}
