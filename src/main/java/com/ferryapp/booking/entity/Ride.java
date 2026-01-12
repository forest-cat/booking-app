package com.ferryapp.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ride {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "departure_port_id", nullable = false)
    private Port departurePort;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arrival_port_id", nullable = false)
    private Port arrivalPort;
    
    @Column(nullable = false)
    private LocalDateTime departureTime;
    
    @Column(nullable = false)
    private LocalDateTime arrivalTime;
    
    @Column(nullable = false)
    private String shipName;
    
    @Column(nullable = false)
    private Integer availableSeats;
    
    @Column(nullable = false)
    private Double pricePerSeat;
}
