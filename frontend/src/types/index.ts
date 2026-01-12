export interface Port {
  id: number;
  code: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Ride {
  id: number;
  departurePort: Port;
  arrivalPort: Port;
  departureTime: string;
  arrivalTime: string;
  shipName: string;
  availableSeats: number;
  pricePerSeat: number;
}

export interface Cabin {
  id: number;
  ride: Ride;
  cabinNumber: string;
  type: string;
  capacity: number;
  price: number;
  available: boolean;
}

export interface WeatherInfo {
  location: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface ShipPosition {
  latitude: number;
  longitude: number;
  status: string;
  speed: number;
}

export interface Booking {
  id: number;
  bookingReference: string;
  bookingDate: string;
  customerName: string;
  departurePort: string;
  arrivalPort: string;
  departureTime: string;
  arrivalTime: string;
  shipName: string;
  cabinNumber: string;
  numberOfPassengers: number;
  totalPrice: number;
  status: string;
  qrCodeBase64?: string;
  weatherInfo?: WeatherInfo;
  shipPosition?: ShipPosition;
}

export interface RideSearchRequest {
  departurePortId: number;
  arrivalPortId: number;
  departureTime: string;
  passengers: number;
}

export interface BookingRequest {
  rideId: number;
  cabinId: number;
  numberOfPassengers: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  passportNumber: string;
}
