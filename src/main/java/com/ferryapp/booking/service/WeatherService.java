package com.ferryapp.booking.service;

import com.ferryapp.booking.dto.WeatherInfo;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {

    public WeatherInfo getWeatherForLocation(Double latitude, Double longitude) {
        // Simulated weather data for demonstration
        // In a real application, this would call an external weather API
        WeatherInfo weatherInfo = new WeatherInfo();
        weatherInfo.setLocation("Port Location");
        weatherInfo.setCondition("Partly Cloudy");
        weatherInfo.setTemperature(22.5);
        weatherInfo.setHumidity(65);
        weatherInfo.setWindSpeed(12.5);
        return weatherInfo;
    }
}
