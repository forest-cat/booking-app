package com.ferryapp.booking.service;

import com.ferryapp.booking.dto.RideSearchRequest;
import com.ferryapp.booking.entity.Ride;
import com.ferryapp.booking.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {
    
    private final RideRepository rideRepository;
    
    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }
    
    public Ride getRideById(Long id) {
        return rideRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ride not found with id: " + id));
    }
    
    public List<Ride> searchRides(RideSearchRequest request) {
        return rideRepository.searchRides(
            request.getDeparturePortId(),
            request.getArrivalPortId(),
            request.getDepartureTime(),
            request.getPassengers()
        );
    }
    
    @Transactional
    public Ride createRide(Ride ride) {
        return rideRepository.save(ride);
    }
    
    @Transactional
    public Ride updateRide(Long id, Ride ride) {
        Ride existingRide = getRideById(id);
        existingRide.setDeparturePort(ride.getDeparturePort());
        existingRide.setArrivalPort(ride.getArrivalPort());
        existingRide.setDepartureTime(ride.getDepartureTime());
        existingRide.setArrivalTime(ride.getArrivalTime());
        existingRide.setShipName(ride.getShipName());
        existingRide.setAvailableSeats(ride.getAvailableSeats());
        existingRide.setPricePerSeat(ride.getPricePerSeat());
        return rideRepository.save(existingRide);
    }
    
    @Transactional
    public void deleteRide(Long id) {
        rideRepository.deleteById(id);
    }
}
