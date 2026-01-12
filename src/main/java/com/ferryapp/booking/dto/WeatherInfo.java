package com.ferryapp.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherInfo {
    private String location;
    private String condition;
    private Double temperature;
    private Integer humidity;
    private Double windSpeed;
}
