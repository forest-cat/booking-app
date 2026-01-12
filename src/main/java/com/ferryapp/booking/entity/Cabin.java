package com.ferryapp.booking.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cabins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cabin {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;
    
    @Column(nullable = false)
    private String cabinNumber;
    
    @Column(nullable = false)
    private String type;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    private Double price;
    
    @Column(nullable = false)
    private Boolean available;
}
