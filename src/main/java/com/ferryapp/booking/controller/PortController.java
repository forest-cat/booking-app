package com.ferryapp.booking.controller;

import com.ferryapp.booking.entity.Port;
import com.ferryapp.booking.service.PortService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ports")
@RequiredArgsConstructor
public class PortController {
    
    private final PortService portService;
    
    @GetMapping
    public ResponseEntity<List<Port>> getAllPorts() {
        return ResponseEntity.ok(portService.getAllPorts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Port> getPortById(@PathVariable Long id) {
        return ResponseEntity.ok(portService.getPortById(id));
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<Port> getPortByCode(@PathVariable String code) {
        return ResponseEntity.ok(portService.getPortByCode(code));
    }
    
    @PostMapping
    public ResponseEntity<Port> createPort(@RequestBody Port port) {
        return ResponseEntity.status(HttpStatus.CREATED).body(portService.createPort(port));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Port> updatePort(@PathVariable Long id, @RequestBody Port port) {
        return ResponseEntity.ok(portService.updatePort(id, port));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePort(@PathVariable Long id) {
        portService.deletePort(id);
        return ResponseEntity.noContent().build();
    }
}
