# Quick Start Guide - Ferry Booking App

This guide will help you get the full-stack ferry booking application up and running quickly.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local frontend development)
- Java 17+ (for local backend development)

## Running with Docker Compose (Recommended)

### Start All Services

```bash
docker compose up --build
```

This will start three services:
1. **PostgreSQL Database** - Port 5432
2. **Backend API** - Port 8080 (http://localhost:8080)
3. **Frontend App** - Port 3000 (http://localhost:3000)

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432 (PostgreSQL)

### Stop All Services

```bash
docker compose down
```

## Running Locally (Development)

### Backend

1. Start PostgreSQL:
```bash
docker compose up postgres
```

2. Run the Spring Boot application:
```bash
./gradlew bootRun
```

Backend will be available at http://localhost:8080

### Frontend

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm start
```

Frontend will be available at http://localhost:3000

## Testing the Application

### 1. Search for Ferry Rides

1. Open http://localhost:3000
2. Select a departure and arrival port from the dropdown
3. Choose a departure date and number of passengers
4. Click "Search"

### 2. Book a Trip

1. From search results, click "Select Cabin" on any ride
2. Choose a cabin from the available options
3. Fill in passenger information:
   - First Name & Last Name
   - Email
   - Phone Number
   - Passport Number
   - Number of Passengers
4. Review the price breakdown
5. Click "Confirm Booking"

### 3. View Booking Confirmation

After booking, you'll see:
- Booking reference number
- Trip details (ship, ports, times, cabin)
- QR code for check-in
- Current weather at departure port
- Live ship position on interactive map

### 4. View Dashboard

1. Click "Dashboard" in the navigation bar
2. Enter a customer ID (e.g., 1 if you created a booking)
3. Click "Search"
4. View all bookings with:
   - Trip status
   - Weather conditions
   - Live ship positions on map

## Sample Data

The application includes sample data with:
- Multiple ports (New York, London, Sydney, Tokyo, etc.)
- Ferry rides between ports
- Available cabins on each ride

## API Endpoints

### Ports
- `GET /api/ports` - Get all ports
- `GET /api/ports/{id}` - Get port by ID

### Rides
- `POST /api/rides/search` - Search for available rides
- `GET /api/rides` - Get all rides

### Cabins
- `GET /api/cabins/ride/{rideId}` - Get available cabins for a ride

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings/{reference}` - Get booking details (includes QR code, weather, ship position)
- `GET /api/bookings/customer/{customerId}` - Get all bookings for a customer

## Troubleshooting

### Frontend can't connect to backend

1. Verify backend is running on port 8080
2. Check `.env` file in frontend directory has correct `REACT_APP_API_URL`
3. Check browser console for CORS errors

### Database connection errors

1. Ensure PostgreSQL is running
2. Check database credentials in `docker-compose.yml` or `application.properties`
3. Verify database is healthy: `docker compose ps`

### Docker build failures

1. Clean Docker cache: `docker system prune -a`
2. Rebuild: `docker compose up --build`
3. Check Docker logs: `docker compose logs`

## Features

### Frontend Features
- ✅ Responsive design (mobile & desktop)
- ✅ Material-UI components
- ✅ React Router navigation
- ✅ React Query for data fetching
- ✅ Interactive maps with Leaflet
- ✅ QR code display
- ✅ Real-time weather information
- ✅ Live ship position tracking

### Backend Features
- ✅ RESTful API with Spring Boot
- ✅ PostgreSQL database
- ✅ Flyway migrations
- ✅ QR code generation
- ✅ Mock weather service
- ✅ Mock ship position tracking

## Development Tips

### Hot Reload

- **Frontend**: Changes automatically reload in development mode
- **Backend**: Use Spring Boot DevTools for hot reload

### Database Reset

To reset the database:
```bash
docker compose down -v  # Remove volumes
docker compose up postgres  # Restart with fresh database
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f app
docker compose logs -f postgres
```

## Production Deployment

### Build Frontend

```bash
cd frontend
npm run build
```

The production build will be in `frontend/build/`.

### Build Backend

```bash
./gradlew build
```

The JAR file will be in `build/libs/`.

### Docker Production Build

```bash
docker compose build --no-cache
docker compose up -d
```

## Support

For issues or questions:
1. Check the main README.md
2. Review API documentation in API.md
3. Check CI/CD documentation in CICD.md
