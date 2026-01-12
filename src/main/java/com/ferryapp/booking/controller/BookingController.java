package com.ferryapp.booking.controller;

import com.ferryapp.booking.dto.BookingRequest;
import com.ferryapp.booking.dto.BookingResponse;
import com.ferryapp.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }
    
    @GetMapping("/{reference}")
    public ResponseEntity<BookingResponse> getBookingByReference(@PathVariable String reference) {
        return ResponseEntity.ok(bookingService.getBookingByReference(reference));
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }
}
