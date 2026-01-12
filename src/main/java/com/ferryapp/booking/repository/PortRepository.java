package com.ferryapp.booking.repository;

import com.ferryapp.booking.entity.Port;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PortRepository extends JpaRepository<Port, Long> {
    Optional<Port> findByCode(String code);
}
