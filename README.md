# Ferry Booking Application

A full-stack application for booking ferry rides, built with Spring Boot backend and React frontend.

**📘 [Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes!

## Features

### Backend
- **Port Management**: Create, read, update, and delete ferry ports
- **Ride Management**: Manage ferry rides between ports with scheduling
- **Cabin Selection**: Book specific cabins on ferry rides
- **Customer Management**: Handle customer information and bookings
- **Booking System**: Complete booking workflow with:
  - Search for available rides
  - Select cabins
  - Generate QR codes for check-in
  - Weather information for departure port
  - Ship position tracking
- **RESTful API**: Comprehensive REST endpoints for all operations
- **Database Migration**: Automated schema management with Flyway
- **Docker Support**: Containerized deployment with Docker Compose

### Frontend
- **Search & Book Ferry Rides**: User-friendly search interface with real-time results
- **Interactive Cabin Selection**: Visual cabin selection with pricing details
- **Booking Confirmation**: QR code generation for check-in
- **Dashboard**: View all bookings with trip status, weather, and ship positions
- **Interactive Maps**: Live ship tracking with Leaflet maps
- **Responsive Design**: Fully responsive UI for mobile and desktop

## Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.1**
- **PostgreSQL 15**
- **Gradle 8.5**
- **Flyway** for database migrations
- **Lombok** for reducing boilerplate
- **ZXing** for QR code generation
- **Docker & Docker Compose** for containerization

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **React Query (TanStack Query)** for data fetching
- **Axios** for API calls
- **React Leaflet** for interactive maps
- **Nginx** for production serving

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher (for frontend development)
- Docker and Docker Compose (for containerized deployment)
- PostgreSQL 15 (if running locally without Docker)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/forest-cat/booking-app.git
cd booking-app
```

2. Start the application with Docker Compose:
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 8080 (http://localhost:8080)
- Frontend application on port 3000 (http://localhost:3000)

### Running Locally

#### Backend

1. Start PostgreSQL database:
```bash
# Create database
createdb -U postgres ferrydb
```

2. Update `src/main/resources/application.properties` with your database credentials

3. Build and run the application:
```bash
./gradlew bootRun
```

#### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## API Endpoints

### Ports
- `GET /api/ports` - Get all ports
- `GET /api/ports/{id}` - Get port by ID
- `GET /api/ports/code/{code}` - Get port by code
- `POST /api/ports` - Create a new port
- `PUT /api/ports/{id}` - Update a port
- `DELETE /api/ports/{id}` - Delete a port

### Rides
- `GET /api/rides` - Get all rides
- `GET /api/rides/{id}` - Get ride by ID
- `POST /api/rides/search` - Search for available rides
- `POST /api/rides` - Create a new ride
- `PUT /api/rides/{id}` - Update a ride
- `DELETE /api/rides/{id}` - Delete a ride

### Cabins
- `GET /api/cabins` - Get all cabins
- `GET /api/cabins/{id}` - Get cabin by ID
- `GET /api/cabins/ride/{rideId}` - Get available cabins for a ride
- `POST /api/cabins` - Create a new cabin
- `PUT /api/cabins/{id}` - Update a cabin
- `DELETE /api/cabins/{id}` - Delete a cabin

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/{reference}` - Get booking by reference (includes QR code, weather, and ship position)
- `GET /api/bookings/customer/{customerId}` - Get all bookings for a customer

## Database Schema

The application uses the following main entities:

- **Ports**: Ferry port locations with geographic coordinates
- **Rides**: Ferry rides between ports with scheduling and pricing
- **Cabins**: Available cabins on each ride
- **Customers**: Customer information
- **Bookings**: Customer bookings linking rides and cabins

## Sample API Usage

### Search for Rides
```bash
curl -X POST http://localhost:8080/api/rides/search \
  -H "Content-Type: application/json" \
  -d '{
    "departurePortId": 1,
    "arrivalPortId": 2,
    "departureTime": "2026-02-01T00:00:00",
    "passengers": 2
  }'
```

### Create a Booking
```bash
curl -X POST http://localhost:8080/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "rideId": 1,
    "cabinId": 1,
    "numberOfPassengers": 2,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "passportNumber": "AB123456"
  }'
```

### Get Booking Details (with QR Code, Weather, and Ship Position)
```bash
curl http://localhost:8080/api/bookings/{bookingReference}
```

## Development

### Building the Project
```bash
./gradlew build
```

### Running Tests
```bash
./gradlew test
```

### Database Migrations

Flyway migrations are located in `src/main/resources/db/migration`. They run automatically on application startup.

- `V1__Create_tables.sql` - Initial schema creation
- `V2__Insert_sample_data.sql` - Sample data for testing

## Docker Deployment

The application includes:
- **Dockerfile**: Multi-stage build for optimized image size
- **docker-compose.yml**: Orchestrates PostgreSQL and application containers

To rebuild and restart:
```bash
docker-compose down
docker-compose up --build
```

## License

This project is licensed under the MIT License.
