# API Documentation

## Base URL
```
http://localhost:8080/api
```

## Endpoints

### Ports API

#### Get All Ports
```http
GET /ports
```

**Response:**
```json
[
  {
    "id": 1,
    "code": "NYC",
    "name": "New York Harbor",
    "city": "New York",
    "country": "USA",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
]
```

#### Get Port by ID
```http
GET /ports/{id}
```

#### Get Port by Code
```http
GET /ports/code/{code}
```

#### Create Port
```http
POST /ports
Content-Type: application/json

{
  "code": "SFO",
  "name": "San Francisco Port",
  "city": "San Francisco",
  "country": "USA",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

#### Update Port
```http
PUT /ports/{id}
Content-Type: application/json

{
  "code": "SFO",
  "name": "San Francisco Port Updated",
  "city": "San Francisco",
  "country": "USA",
  "latitude": 37.7749,
  "longitude": -122.4194
}
```

#### Delete Port
```http
DELETE /ports/{id}
```

---

### Rides API

#### Get All Rides
```http
GET /rides
```

#### Get Ride by ID
```http
GET /rides/{id}
```

#### Search Rides
```http
POST /rides/search
Content-Type: application/json

{
  "departurePortId": 1,
  "arrivalPortId": 2,
  "departureTime": "2026-02-01T00:00:00",
  "passengers": 2
}
```

**Response:**
```json
[
  {
    "id": 1,
    "departurePort": {...},
    "arrivalPort": {...},
    "departureTime": "2026-02-01T10:00:00",
    "arrivalTime": "2026-02-02T18:00:00",
    "shipName": "Atlantic Voyager",
    "availableSeats": 200,
    "pricePerSeat": 150.00
  }
]
```

#### Create Ride
```http
POST /rides
Content-Type: application/json

{
  "departurePort": { "id": 1 },
  "arrivalPort": { "id": 2 },
  "departureTime": "2026-03-01T10:00:00",
  "arrivalTime": "2026-03-02T18:00:00",
  "shipName": "New Ferry",
  "availableSeats": 150,
  "pricePerSeat": 200.00
}
```

#### Update Ride
```http
PUT /rides/{id}
```

#### Delete Ride
```http
DELETE /rides/{id}
```

---

### Cabins API

#### Get All Cabins
```http
GET /cabins
```

#### Get Cabin by ID
```http
GET /cabins/{id}
```

#### Get Available Cabins for Ride
```http
GET /cabins/ride/{rideId}
```

**Response:**
```json
[
  {
    "id": 1,
    "ride": {...},
    "cabinNumber": "A101",
    "type": "Standard",
    "capacity": 2,
    "price": 100.00,
    "available": true
  }
]
```

#### Create Cabin
```http
POST /cabins
Content-Type: application/json

{
  "ride": { "id": 1 },
  "cabinNumber": "B301",
  "type": "Deluxe",
  "capacity": 4,
  "price": 250.00,
  "available": true
}
```

#### Update Cabin
```http
PUT /cabins/{id}
```

#### Delete Cabin
```http
DELETE /cabins/{id}
```

---

### Bookings API

#### Create Booking
```http
POST /bookings
Content-Type: application/json

{
  "rideId": 1,
  "cabinId": 1,
  "numberOfPassengers": 2,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "passportNumber": "AB123456"
}
```

**Response:**
```json
{
  "id": 1,
  "bookingReference": "A1B2C3D4",
  "bookingDate": "2026-01-12T13:00:00",
  "customerName": "John Doe",
  "departurePort": "New York Harbor",
  "arrivalPort": "Port of London",
  "departureTime": "2026-02-01T10:00:00",
  "arrivalTime": "2026-02-02T18:00:00",
  "shipName": "Atlantic Voyager",
  "cabinNumber": "A101",
  "numberOfPassengers": 2,
  "totalPrice": 400.00,
  "status": "CONFIRMED",
  "qrCodeBase64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "weatherInfo": {
    "location": "Port Location",
    "condition": "Partly Cloudy",
    "temperature": 22.5,
    "humidity": 65,
    "windSpeed": 12.5
  },
  "shipPosition": {
    "latitude": 45.5017,
    "longitude": -73.5673,
    "status": "In Transit",
    "speed": 18.5
  }
}
```

#### Get Booking by Reference
```http
GET /bookings/{bookingReference}
```

Returns the same structure as create booking, including:
- QR code (base64 encoded PNG)
- Current weather information
- Current ship position

#### Get Customer Bookings
```http
GET /bookings/customer/{customerId}
```

**Response:**
```json
[
  {
    "id": 1,
    "bookingReference": "A1B2C3D4",
    ...
  }
]
```

---

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

```json
{
  "timestamp": "2026-01-12T13:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/bookings"
}
```

### Common Status Codes
- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Business Rules

### Booking
- Customers are automatically created if they don't exist (based on email)
- Available seats are checked before booking
- Cabins are marked as unavailable when booked
- Total price = (passengers × ride price) + cabin price (if selected)
- Booking reference is automatically generated (8 characters)

### Ride Search
- Only returns rides with enough available seats
- Only returns rides departing after the specified time
- Results include all ride details including ports

### Cabin Availability
- Only available cabins are returned when searching by ride
- Cabins become unavailable when booked
