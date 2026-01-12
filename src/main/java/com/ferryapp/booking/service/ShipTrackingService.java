package com.ferryapp.booking.service;

import com.ferryapp.booking.dto.ShipPosition;
import org.springframework.stereotype.Service;

@Service
public class ShipTrackingService {

    public ShipPosition getShipPosition(String shipName) {
        // Simulated ship position data for demonstration
        // In a real application, this would call an external ship tracking API
        ShipPosition position = new ShipPosition();
        position.setLatitude(45.5017);
        position.setLongitude(-73.5673);
        position.setStatus("In Transit");
        position.setSpeed(18.5);
        return position;
    }
}
