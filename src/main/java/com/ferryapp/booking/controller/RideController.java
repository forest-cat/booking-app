package com.ferryapp.booking.controller;

import com.ferryapp.booking.dto.RideSearchRequest;
import com.ferryapp.booking.entity.Ride;
import com.ferryapp.booking.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {
    
    private final RideService rideService;
    
    @GetMapping
    public ResponseEntity<List<Ride>> getAllRides() {
        return ResponseEntity.ok(rideService.getAllRides());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ride> getRideById(@PathVariable Long id) {
        return ResponseEntity.ok(rideService.getRideById(id));
    }
    
    @PostMapping("/search")
    public ResponseEntity<List<Ride>> searchRides(@Valid @RequestBody RideSearchRequest request) {
        return ResponseEntity.ok(rideService.searchRides(request));
    }
    
    @PostMapping
    public ResponseEntity<Ride> createRide(@RequestBody Ride ride) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rideService.createRide(ride));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Ride> updateRide(@PathVariable Long id, @RequestBody Ride ride) {
        return ResponseEntity.ok(rideService.updateRide(id, ride));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRide(@PathVariable Long id) {
        rideService.deleteRide(id);
        return ResponseEntity.noContent().build();
    }
}
