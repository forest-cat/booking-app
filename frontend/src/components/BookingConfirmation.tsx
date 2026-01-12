import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  CheckCircle,
  DirectionsBoat,
  Person,
  AttachMoney,
  Cloud,
  Navigation,
} from '@mui/icons-material';
import { Booking } from '../types';

interface BookingConfirmationProps {
  booking: Booking;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking }) => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Alert
        icon={<CheckCircle fontSize="inherit" />}
        severity="success"
        sx={{ mb: 3 }}
      >
        <Typography variant="h6">Booking Confirmed!</Typography>
        <Typography variant="body2">
          Your booking reference: <strong>{booking.bookingReference}</strong>
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Booking Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsBoat /> Trip Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ship
                </Typography>
                <Typography variant="h6">{booking.shipName}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Departure
                </Typography>
                <Typography variant="body1">{booking.departurePort}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(booking.departureTime)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Arrival
                </Typography>
                <Typography variant="body1">{booking.arrivalPort}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDateTime(booking.arrivalTime)}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Cabin
                </Typography>
                <Typography variant="body1">{booking.cabinNumber}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Passengers
                </Typography>
                <Typography variant="body1">
                  <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                  {booking.numberOfPassengers}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <AttachMoney color="success" />
                  <Typography variant="h5" color="success.main">
                    Total: ${booking.totalPrice.toFixed(2)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Chip
                  label={booking.status}
                  color="success"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Weather Information */}
          {booking.weatherInfo && (
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Cloud /> Current Weather at Departure
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Condition
                  </Typography>
                  <Typography variant="body1">
                    {booking.weatherInfo.condition}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Temperature
                  </Typography>
                  <Typography variant="body1">
                    {booking.weatherInfo.temperature}°C
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Humidity
                  </Typography>
                  <Typography variant="body1">
                    {booking.weatherInfo.humidity}%
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Wind Speed
                  </Typography>
                  <Typography variant="body1">
                    {booking.weatherInfo.windSpeed} km/h
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Ship Position */}
          {booking.shipPosition && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Navigation /> Current Ship Position
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Latitude
                  </Typography>
                  <Typography variant="body1">
                    {booking.shipPosition.latitude.toFixed(4)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Longitude
                  </Typography>
                  <Typography variant="body1">
                    {booking.shipPosition.longitude.toFixed(4)}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography variant="body1">
                    {booking.shipPosition.status}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Speed
                  </Typography>
                  <Typography variant="body1">
                    {booking.shipPosition.speed} knots
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* QR Code */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Check-in QR Code
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Present this code at check-in
            </Typography>
            {booking.qrCodeBase64 && (
              <Box
                component="img"
                src={`data:image/png;base64,${booking.qrCodeBase64}`}
                alt="Booking QR Code"
                sx={{
                  width: '100%',
                  maxWidth: 250,
                  height: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2,
                }}
              />
            )}
            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
              Booking Reference: {booking.bookingReference}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingConfirmation;
