import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { Ride, Cabin, BookingRequest } from '../types';

interface BookingFormProps {
  open: boolean;
  ride: Ride | null;
  cabin: Cabin | null;
  passengers: number;
  onClose: () => void;
  onSubmit: (bookingRequest: BookingRequest) => void;
  loading?: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  open,
  ride,
  cabin,
  passengers,
  onClose,
  onSubmit,
  loading,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    passportNumber: '',
    numberOfPassengers: passengers,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ride && cabin) {
      onSubmit({
        rideId: ride.id,
        cabinId: cabin.id,
        ...formData,
        numberOfPassengers: Number(formData.numberOfPassengers),
      });
    }
  };

  const calculateTotal = () => {
    if (!ride || !cabin) return 0;
    return (ride.pricePerSeat * formData.numberOfPassengers) + cabin.price;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Complete Your Booking</DialogTitle>
        <DialogContent>
          {ride && cabin && (
            <>
              <Box sx={{ mb: 3, mt: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Trip Summary
                </Typography>
                <Typography variant="body1">
                  {ride.departurePort.name} → {ride.arrivalPort.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {ride.shipName} - Cabin {cabin.cabinNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Departs: {new Date(ride.departureTime).toLocaleString()}
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
            </>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1234567890"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Passport Number"
                name="passportNumber"
                value={formData.passportNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="number"
                label="Number of Passengers"
                name="numberOfPassengers"
                value={formData.numberOfPassengers}
                onChange={handleChange}
                inputProps={{ min: 1, max: cabin?.capacity || 10 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Price Breakdown
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                {formData.numberOfPassengers} × ${ride?.pricePerSeat.toFixed(2)} (passengers)
              </Typography>
              <Typography variant="body2">
                ${(ride ? ride.pricePerSeat * formData.numberOfPassengers : 0).toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Cabin {cabin?.cabinNumber}</Typography>
              <Typography variant="body2">${cabin?.price.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="primary">
                ${calculateTotal().toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BookingForm;
