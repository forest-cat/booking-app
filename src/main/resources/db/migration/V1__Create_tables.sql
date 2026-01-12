CREATE TABLE ports (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

CREATE TABLE rides (
    id BIGSERIAL PRIMARY KEY,
    departure_port_id BIGINT NOT NULL REFERENCES ports(id),
    arrival_port_id BIGINT NOT NULL REFERENCES ports(id),
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    ship_name VARCHAR(255) NOT NULL,
    available_seats INTEGER NOT NULL,
    price_per_seat DOUBLE PRECISION NOT NULL
);

CREATE TABLE cabins (
    id BIGSERIAL PRIMARY KEY,
    ride_id BIGINT NOT NULL REFERENCES rides(id),
    cabin_number VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    capacity INTEGER NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(50),
    passport_number VARCHAR(50)
);

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id),
    ride_id BIGINT NOT NULL REFERENCES rides(id),
    cabin_id BIGINT REFERENCES cabins(id),
    booking_reference VARCHAR(50) NOT NULL UNIQUE,
    booking_date TIMESTAMP NOT NULL,
    number_of_passengers INTEGER NOT NULL,
    total_price DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE INDEX idx_rides_departure ON rides(departure_port_id, departure_time);
CREATE INDEX idx_rides_arrival ON rides(arrival_port_id);
CREATE INDEX idx_cabins_ride ON cabins(ride_id);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
