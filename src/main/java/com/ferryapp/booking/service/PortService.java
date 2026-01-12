package com.ferryapp.booking.service;

import com.ferryapp.booking.entity.Port;
import com.ferryapp.booking.repository.PortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortService {
    
    private final PortRepository portRepository;
    
    public List<Port> getAllPorts() {
        return portRepository.findAll();
    }
    
    public Port getPortById(Long id) {
        return portRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Port not found with id: " + id));
    }
    
    public Port getPortByCode(String code) {
        return portRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Port not found with code: " + code));
    }
    
    @Transactional
    public Port createPort(Port port) {
        return portRepository.save(port);
    }
    
    @Transactional
    public Port updatePort(Long id, Port port) {
        Port existingPort = getPortById(id);
        existingPort.setCode(port.getCode());
        existingPort.setName(port.getName());
        existingPort.setCity(port.getCity());
        existingPort.setCountry(port.getCountry());
        existingPort.setLatitude(port.getLatitude());
        existingPort.setLongitude(port.getLongitude());
        return portRepository.save(existingPort);
    }
    
    @Transactional
    public void deletePort(Long id) {
        portRepository.deleteById(id);
    }
}
