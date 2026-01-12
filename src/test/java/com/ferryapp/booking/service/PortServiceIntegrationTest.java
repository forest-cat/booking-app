package com.ferryapp.booking.service;

import com.ferryapp.booking.entity.Port;
import com.ferryapp.booking.repository.PortRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "spring.flyway.enabled=false"
})
@Transactional
class PortServiceIntegrationTest {

    @Autowired
    private PortService portService;

    @Autowired
    private PortRepository portRepository;

    @BeforeEach
    void setUp() {
        portRepository.deleteAll();
    }

    @Test
    void testCreateAndRetrievePort() {
        // Given
        Port port = new Port();
        port.setCode("TST");
        port.setName("Test Port");
        port.setCity("Test City");
        port.setCountry("Test Country");
        port.setLatitude(40.7128);
        port.setLongitude(-74.0060);

        // When
        Port savedPort = portService.createPort(port);

        // Then
        assertNotNull(savedPort.getId());
        assertEquals("TST", savedPort.getCode());
        assertEquals("Test Port", savedPort.getName());
    }

    @Test
    void testGetAllPorts() {
        // Given
        Port port1 = new Port(null, "PRT1", "Port 1", "City 1", "Country 1", 40.0, -74.0);
        Port port2 = new Port(null, "PRT2", "Port 2", "City 2", "Country 2", 41.0, -75.0);
        portService.createPort(port1);
        portService.createPort(port2);

        // When
        List<Port> ports = portService.getAllPorts();

        // Then
        assertEquals(2, ports.size());
    }

    @Test
    void testGetPortByCode() {
        // Given
        Port port = new Port(null, "ABC", "ABC Port", "ABC City", "ABC Country", 40.0, -74.0);
        portService.createPort(port);

        // When
        Port retrievedPort = portService.getPortByCode("ABC");

        // Then
        assertNotNull(retrievedPort);
        assertEquals("ABC", retrievedPort.getCode());
    }

    @Test
    void testUpdatePort() {
        // Given
        Port port = new Port(null, "UPD", "Old Name", "Old City", "Old Country", 40.0, -74.0);
        Port savedPort = portService.createPort(port);

        // When
        savedPort.setName("New Name");
        savedPort.setCity("New City");
        Port updatedPort = portService.updatePort(savedPort.getId(), savedPort);

        // Then
        assertEquals("New Name", updatedPort.getName());
        assertEquals("New City", updatedPort.getCity());
    }
}
