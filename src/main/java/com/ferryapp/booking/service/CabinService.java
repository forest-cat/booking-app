package com.ferryapp.booking.service;

import com.ferryapp.booking.entity.Cabin;
import com.ferryapp.booking.repository.CabinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CabinService {
    
    private final CabinRepository cabinRepository;
    
    public List<Cabin> getAllCabins() {
        return cabinRepository.findAll();
    }
    
    public Cabin getCabinById(Long id) {
        return cabinRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Cabin not found with id: " + id));
    }
    
    public List<Cabin> getAvailableCabinsForRide(Long rideId) {
        return cabinRepository.findByRideIdAndAvailableTrue(rideId);
    }
    
    @Transactional
    public Cabin createCabin(Cabin cabin) {
        return cabinRepository.save(cabin);
    }
    
    @Transactional
    public Cabin updateCabin(Long id, Cabin cabin) {
        Cabin existingCabin = getCabinById(id);
        existingCabin.setRide(cabin.getRide());
        existingCabin.setCabinNumber(cabin.getCabinNumber());
        existingCabin.setType(cabin.getType());
        existingCabin.setCapacity(cabin.getCapacity());
        existingCabin.setPrice(cabin.getPrice());
        existingCabin.setAvailable(cabin.getAvailable());
        return cabinRepository.save(existingCabin);
    }
    
    @Transactional
    public void deleteCabin(Long id) {
        cabinRepository.deleteById(id);
    }
}
