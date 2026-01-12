package com.ferryapp.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabin_id")
    private Cabin cabin;
    
    @Column(nullable = false, unique = true)
    private String bookingReference;
    
    @Column(nullable = false)
    private LocalDateTime bookingDate;
    
    @Column(nullable = false)
    private Integer numberOfPassengers;
    
    @Column(nullable = false)
    private Double totalPrice;
    
    @Column(nullable = false)
    private String status;
}
