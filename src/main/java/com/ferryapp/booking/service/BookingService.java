package com.ferryapp.booking.service;

import com.ferryapp.booking.dto.BookingRequest;
import com.ferryapp.booking.dto.BookingResponse;
import com.ferryapp.booking.entity.Booking;
import com.ferryapp.booking.entity.Cabin;
import com.ferryapp.booking.entity.Customer;
import com.ferryapp.booking.entity.Ride;
import com.ferryapp.booking.repository.BookingRepository;
import com.ferryapp.booking.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final CustomerRepository customerRepository;
    private final RideService rideService;
    private final CabinService cabinService;
    private final QRCodeService qrCodeService;
    private final WeatherService weatherService;
    private final ShipTrackingService shipTrackingService;
    
    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        // Get or create customer
        Customer customer = customerRepository.findByEmail(request.getEmail())
            .orElseGet(() -> {
                Customer newCustomer = new Customer();
                newCustomer.setFirstName(request.getFirstName());
                newCustomer.setLastName(request.getLastName());
                newCustomer.setEmail(request.getEmail());
                newCustomer.setPhoneNumber(request.getPhoneNumber());
                newCustomer.setPassportNumber(request.getPassportNumber());
                return customerRepository.save(newCustomer);
            });
        
        // Get ride
        Ride ride = rideService.getRideById(request.getRideId());
        
        // Check availability
        if (ride.getAvailableSeats() < request.getNumberOfPassengers()) {
            throw new RuntimeException("Not enough available seats");
        }
        
        // Get cabin if specified
        Cabin cabin = null;
        if (request.getCabinId() != null) {
            cabin = cabinService.getCabinById(request.getCabinId());
            if (!cabin.getAvailable()) {
                throw new RuntimeException("Cabin is not available");
            }
            cabin.setAvailable(false);
            cabinService.updateCabin(cabin.getId(), cabin);
        }
        
        // Calculate total price
        Double totalPrice = ride.getPricePerSeat() * request.getNumberOfPassengers();
        if (cabin != null) {
            totalPrice += cabin.getPrice();
        }
        
        // Create booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setRide(ride);
        booking.setCabin(cabin);
        booking.setBookingReference(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setBookingDate(LocalDateTime.now());
        booking.setNumberOfPassengers(request.getNumberOfPassengers());
        booking.setTotalPrice(totalPrice);
        booking.setStatus("CONFIRMED");
        
        // Update available seats
        ride.setAvailableSeats(ride.getAvailableSeats() - request.getNumberOfPassengers());
        rideService.updateRide(ride.getId(), ride);
        
        booking = bookingRepository.save(booking);
        
        return convertToResponse(booking);
    }
    
    public BookingResponse getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new RuntimeException("Booking not found with reference: " + reference));
        return convertToResponse(booking);
    }
    
    public List<BookingResponse> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerId(customerId).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setBookingReference(booking.getBookingReference());
        response.setBookingDate(booking.getBookingDate());
        response.setCustomerName(booking.getCustomer().getFirstName() + " " + booking.getCustomer().getLastName());
        response.setDeparturePort(booking.getRide().getDeparturePort().getName());
        response.setArrivalPort(booking.getRide().getArrivalPort().getName());
        response.setDepartureTime(booking.getRide().getDepartureTime());
        response.setArrivalTime(booking.getRide().getArrivalTime());
        response.setShipName(booking.getRide().getShipName());
        response.setCabinNumber(booking.getCabin() != null ? booking.getCabin().getCabinNumber() : null);
        response.setNumberOfPassengers(booking.getNumberOfPassengers());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus());
        
        // Generate QR code
        String qrData = "Booking: " + booking.getBookingReference() + 
                       ", Ride: " + booking.getRide().getShipName() +
                       ", From: " + booking.getRide().getDeparturePort().getCode() +
                       " To: " + booking.getRide().getArrivalPort().getCode();
        response.setQrCodeBase64(qrCodeService.generateQRCode(qrData));
        
        // Get weather info
        response.setWeatherInfo(weatherService.getWeatherForLocation(
            booking.getRide().getDeparturePort().getLatitude(),
            booking.getRide().getDeparturePort().getLongitude()
        ));
        
        // Get ship position
        response.setShipPosition(shipTrackingService.getShipPosition(booking.getRide().getShipName()));
        
        return response;
    }
}
