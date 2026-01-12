package com.ferryapp.booking.controller;

import com.ferryapp.booking.entity.Cabin;
import com.ferryapp.booking.service.CabinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cabins")
@RequiredArgsConstructor
public class CabinController {
    
    private final CabinService cabinService;
    
    @GetMapping
    public ResponseEntity<List<Cabin>> getAllCabins() {
        return ResponseEntity.ok(cabinService.getAllCabins());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Cabin> getCabinById(@PathVariable Long id) {
        return ResponseEntity.ok(cabinService.getCabinById(id));
    }
    
    @GetMapping("/ride/{rideId}")
    public ResponseEntity<List<Cabin>> getAvailableCabinsForRide(@PathVariable Long rideId) {
        return ResponseEntity.ok(cabinService.getAvailableCabinsForRide(rideId));
    }
    
    @PostMapping
    public ResponseEntity<Cabin> createCabin(@RequestBody Cabin cabin) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cabinService.createCabin(cabin));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Cabin> updateCabin(@PathVariable Long id, @RequestBody Cabin cabin) {
        return ResponseEntity.ok(cabinService.updateCabin(id, cabin));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCabin(@PathVariable Long id) {
        cabinService.deleteCabin(id);
        return ResponseEntity.noContent().build();
    }
}
