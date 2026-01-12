package com.ferryapp.booking.service;

import com.ferryapp.booking.dto.BookingRequest;
import com.ferryapp.booking.dto.BookingResponse;
import com.ferryapp.booking.entity.Cabin;
import com.ferryapp.booking.entity.Port;
import com.ferryapp.booking.entity.Ride;
import com.ferryapp.booking.repository.BookingRepository;
import com.ferryapp.booking.repository.CabinRepository;
import com.ferryapp.booking.repository.CustomerRepository;
import com.ferryapp.booking.repository.PortRepository;
import com.ferryapp.booking.repository.RideRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false"
})
@Transactional
class BookingServiceIntegrationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PortRepository portRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private CabinRepository cabinRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerRepository customerRepository;

    private Port departurePort;
    private Port arrivalPort;
    private Ride ride;
    private Cabin cabin;

    @BeforeEach
    void setUp() {
        bookingRepository.deleteAll();
        cabinRepository.deleteAll();
        rideRepository.deleteAll();
        customerRepository.deleteAll();
        portRepository.deleteAll();

        // Create test ports
        departurePort = new Port(null, "NYC", "New York", "New York", "USA", 40.7128, -74.0060);
        arrivalPort = new Port(null, "LON", "London", "London", "UK", 51.5074, -0.1278);
        departurePort = portRepository.save(departurePort);
        arrivalPort = portRepository.save(arrivalPort);

        // Create test ride
        ride = new Ride();
        ride.setDeparturePort(departurePort);
        ride.setArrivalPort(arrivalPort);
        ride.setDepartureTime(LocalDateTime.now().plusDays(1));
        ride.setArrivalTime(LocalDateTime.now().plusDays(2));
        ride.setShipName("Test Ship");
        ride.setAvailableSeats(100);
        ride.setPricePerSeat(150.0);
        ride = rideRepository.save(ride);

        // Create test cabin
        cabin = new Cabin();
        cabin.setRide(ride);
        cabin.setCabinNumber("A101");
        cabin.setType("Standard");
        cabin.setCapacity(2);
        cabin.setPrice(100.0);
        cabin.setAvailable(true);
        cabin = cabinRepository.save(cabin);
    }

    @Test
    void testCreateBookingWithCabin() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRideId(ride.getId());
        request.setCabinId(cabin.getId());
        request.setNumberOfPassengers(2);
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("john.doe@example.com");
        request.setPhoneNumber("+1234567890");
        request.setPassportNumber("AB123456");

        // When
        BookingResponse response = bookingService.createBooking(request);

        // Then
        assertNotNull(response);
        assertNotNull(response.getId());
        assertNotNull(response.getBookingReference());
        assertEquals("John Doe", response.getCustomerName());
        assertEquals(2, response.getNumberOfPassengers());
        assertEquals(400.0, response.getTotalPrice()); // 2 passengers * 150 + cabin 100
        assertEquals("CONFIRMED", response.getStatus());
        assertNotNull(response.getQrCodeBase64());
        assertNotNull(response.getWeatherInfo());
        assertNotNull(response.getShipPosition());
    }

    @Test
    void testCreateBookingWithoutCabin() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRideId(ride.getId());
        request.setNumberOfPassengers(3);
        request.setFirstName("Jane");
        request.setLastName("Smith");
        request.setEmail("jane.smith@example.com");
        request.setPhoneNumber("+1234567891");

        // When
        BookingResponse response = bookingService.createBooking(request);

        // Then
        assertNotNull(response);
        assertEquals(450.0, response.getTotalPrice()); // 3 passengers * 150
        assertNull(response.getCabinNumber());
    }

    @Test
    void testGetBookingByReference() {
        // Given
        BookingRequest request = new BookingRequest();
        request.setRideId(ride.getId());
        request.setNumberOfPassengers(1);
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test@example.com");

        BookingResponse createdBooking = bookingService.createBooking(request);

        // When
        BookingResponse retrievedBooking = bookingService.getBookingByReference(createdBooking.getBookingReference());

        // Then
        assertNotNull(retrievedBooking);
        assertEquals(createdBooking.getBookingReference(), retrievedBooking.getBookingReference());
        assertEquals(createdBooking.getTotalPrice(), retrievedBooking.getTotalPrice());
    }

    @Test
    void testBookingReducesAvailableSeats() {
        // Given
        int initialSeats = ride.getAvailableSeats();
        BookingRequest request = new BookingRequest();
        request.setRideId(ride.getId());
        request.setNumberOfPassengers(5);
        request.setFirstName("Test");
        request.setLastName("User");
        request.setEmail("test2@example.com");

        // When
        bookingService.createBooking(request);

        // Then
        Ride updatedRide = rideRepository.findById(ride.getId()).orElseThrow();
        assertEquals(initialSeats - 5, updatedRide.getAvailableSeats());
    }
}
