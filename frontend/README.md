# Ferry Booking Frontend

React-based frontend application for the ferry booking system.

## Features

- **Search & Book Ferry Rides**: Search for available ferry rides between ports and book cabins
- **Interactive Cabin Selection**: Choose from available cabins with different types and capacities
- **Booking Confirmation**: View booking details with QR code for check-in
- **Dashboard**: View all your bookings with real-time weather and ship positions
- **Interactive Maps**: Live ship tracking with Leaflet maps
- **Responsive Design**: Fully responsive UI for mobile and desktop

## Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **React Query (TanStack Query)** for data fetching
- **Axios** for API calls
- **React Leaflet** for interactive maps
- **Docker** with Nginx for production deployment

## Prerequisites

- Node.js 18+ and npm
- Backend API running on http://localhost:8080

## Getting Started

### Development Mode

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm start
```

The app will be available at http://localhost:3000

### Production Build

Build the application:
```bash
npm run build
```

The optimized production build will be in the `build/` directory.

### Docker Deployment

Build and run with Docker:
```bash
docker build -t ferry-frontend .
docker run -p 3000:80 ferry-frontend
```

Or use docker-compose from the root directory:
```bash
cd ..
docker-compose up --build
```

## Environment Variables

- `REACT_APP_API_URL` - Backend API base URL (default: http://localhost:8080/api)

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (one-way operation)

## Project Structure

```
frontend/
├── public/          # Static files
├── src/
│   ├── api/         # API client and hooks
│   ├── components/  # Reusable components
│   ├── pages/       # Page components
│   ├── types/       # TypeScript types
│   ├── utils/       # Utility functions
│   ├── App.tsx      # Main app component
│   └── index.tsx    # Entry point
├── Dockerfile       # Docker configuration
└── nginx.conf       # Nginx configuration
```

## Features Overview

### Home Page
- Search form to find available ferry rides
- Display search results with ride details
- Select cabins for rides
- Complete booking with passenger information
- View booking confirmation with QR code

### Dashboard
- Search bookings by customer ID
- View all bookings with trip details
- Real-time weather information
- Live ship position tracking on interactive maps

## API Integration

The frontend connects to the backend API at `/api` endpoint with the following features:
- Port management
- Ride search
- Cabin availability
- Booking creation
- Customer bookings retrieval

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
