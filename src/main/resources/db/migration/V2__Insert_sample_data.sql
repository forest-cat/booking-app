-- Insert sample ports
INSERT INTO ports (code, name, city, country, latitude, longitude) VALUES
('NYC', 'New York Harbor', 'New York', 'USA', 40.7128, -74.0060),
('LON', 'Port of London', 'London', 'UK', 51.5074, -0.1278),
('PAR', 'Port de Paris', 'Paris', 'France', 48.8566, 2.3522),
('TOK', 'Tokyo Port', 'Tokyo', 'Japan', 35.6762, 139.6503),
('SYD', 'Sydney Harbor', 'Sydney', 'Australia', -33.8688, 151.2093);

-- Insert sample rides
INSERT INTO rides (departure_port_id, arrival_port_id, departure_time, arrival_time, ship_name, available_seats, price_per_seat) VALUES
(1, 2, '2026-02-01 10:00:00', '2026-02-02 18:00:00', 'Atlantic Voyager', 200, 150.00),
(2, 1, '2026-02-03 09:00:00', '2026-02-04 17:00:00', 'Atlantic Voyager', 200, 150.00),
(2, 3, '2026-02-05 08:00:00', '2026-02-05 14:00:00', 'Channel Express', 150, 80.00),
(3, 2, '2026-02-06 10:00:00', '2026-02-06 16:00:00', 'Channel Express', 150, 80.00),
(4, 5, '2026-02-10 11:00:00', '2026-02-15 20:00:00', 'Pacific Dream', 300, 250.00);

-- Insert sample cabins
INSERT INTO cabins (ride_id, cabin_number, type, capacity, price, available) VALUES
(1, 'A101', 'Standard', 2, 100.00, TRUE),
(1, 'A102', 'Standard', 2, 100.00, TRUE),
(1, 'B201', 'Deluxe', 2, 200.00, TRUE),
(1, 'B202', 'Deluxe', 2, 200.00, TRUE),
(1, 'S301', 'Suite', 4, 500.00, TRUE),
(2, 'A101', 'Standard', 2, 100.00, TRUE),
(2, 'A102', 'Standard', 2, 100.00, TRUE),
(3, 'C101', 'Standard', 2, 50.00, TRUE),
(3, 'C102', 'Standard', 2, 50.00, TRUE),
(5, 'P101', 'Premium', 2, 300.00, TRUE);
