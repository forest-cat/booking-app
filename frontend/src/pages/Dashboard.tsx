import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  DirectionsBoat,
  Event,
  Cloud,
  Navigation,
  Search,
} from '@mui/icons-material';
import { useCustomerBookings } from '../api/hooks';
import ShipMap from '../components/ShipMap';
import { Booking } from '../types';

const Dashboard: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>('');
  const [searchedId, setSearchedId] = useState<number | null>(null);
  const { data: bookings, isLoading, error } = useCustomerBookings(searchedId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId) {
      setSearchedId(Number(customerId));
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Bookings Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View all your ferry bookings, weather conditions, and live ship positions
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              label="Customer ID"
              type="number"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Enter your customer ID"
              helperText="Enter your customer ID to view all your bookings"
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Search />}
              sx={{ height: '56px', minWidth: '120px' }}
            >
              Search
            </Button>
          </Box>
        </form>
      </Paper>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load bookings. Please try again.
        </Alert>
      )}

      {bookings && bookings.length === 0 && searchedId && (
        <Alert severity="info">
          No bookings found for customer ID {searchedId}.
        </Alert>
      )}

      {bookings && bookings.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Your Bookings ({bookings.length})
          </Typography>
          <Grid container spacing={3}>
            {bookings.map((booking: Booking) => (
              <Grid item xs={12} key={booking.id}>
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsBoat color="primary" />
                        <Typography variant="h6">{booking.shipName}</Typography>
                      </Box>
                      <Chip
                        label={booking.status}
                        color={booking.status === 'CONFIRMED' ? 'success' : 'default'}
                      />
                    </Box>

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Booking Reference: <strong>{booking.bookingReference}</strong>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Grid container spacing={3}>
                      {/* Trip Details */}
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <Event fontSize="small" /> Trip Details
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>From:</strong> {booking.departurePort}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {formatDateTime(booking.departureTime)}
                          </Typography>
                          <Typography variant="body1" gutterBottom>
                            <strong>To:</strong> {booking.arrivalPort}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {formatDateTime(booking.arrivalTime)}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 2 }}>
                            <strong>Cabin:</strong> {booking.cabinNumber}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Passengers:</strong> {booking.numberOfPassengers}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Total Price:</strong> ${booking.totalPrice.toFixed(2)}
                          </Typography>
                        </Box>

                        {/* Weather Info */}
                        {booking.weatherInfo && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <Cloud fontSize="small" /> Current Weather
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Condition:</strong> {booking.weatherInfo.condition}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Temp:</strong> {booking.weatherInfo.temperature}°C
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2">
                                  <strong>Humidity:</strong> {booking.weatherInfo.humidity}%
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Wind:</strong> {booking.weatherInfo.windSpeed} km/h
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        )}

                        {/* Ship Position Info */}
                        {booking.shipPosition && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                              <Navigation fontSize="small" /> Ship Position
                            </Typography>
                            <Typography variant="body2">
                              <strong>Status:</strong> {booking.shipPosition.status}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Speed:</strong> {booking.shipPosition.speed} knots
                            </Typography>
                            <Typography variant="body2">
                              <strong>Location:</strong> {booking.shipPosition.latitude.toFixed(4)}, {booking.shipPosition.longitude.toFixed(4)}
                            </Typography>
                          </Box>
                        )}
                      </Grid>

                      {/* Ship Map */}
                      <Grid item xs={12} md={6}>
                        {booking.shipPosition && (
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Live Ship Position
                            </Typography>
                            <ShipMap
                              position={booking.shipPosition}
                              shipName={booking.shipName}
                            />
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
