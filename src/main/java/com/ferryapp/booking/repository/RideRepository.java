package com.ferryapp.booking.repository;

import com.ferryapp.booking.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    
    @Query("SELECT r FROM Ride r WHERE r.departurePort.id = :departurePortId " +
           "AND r.arrivalPort.id = :arrivalPortId " +
           "AND r.departureTime >= :departureTime " +
           "AND r.availableSeats >= :passengers")
    List<Ride> searchRides(
        @Param("departurePortId") Long departurePortId,
        @Param("arrivalPortId") Long arrivalPortId,
        @Param("departureTime") LocalDateTime departureTime,
        @Param("passengers") Integer passengers
    );
}
