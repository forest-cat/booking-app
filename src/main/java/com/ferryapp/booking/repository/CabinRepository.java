package com.ferryapp.booking.repository;

import com.ferryapp.booking.entity.Cabin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CabinRepository extends JpaRepository<Cabin, Long> {
    List<Cabin> findByRideIdAndAvailableTrue(Long rideId);
}
