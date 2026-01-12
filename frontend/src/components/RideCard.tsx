import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import {
  DirectionsBoat,
  AccessTime,
  EventSeat,
  AttachMoney,
} from '@mui/icons-material';
import { Ride } from '../types';

interface RideCardProps {
  ride: Ride;
  onSelect: (ride: Ride) => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, onSelect }) => {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const calculateDuration = () => {
    const departure = new Date(ride.departureTime);
    const arrival = new Date(ride.arrivalTime);
    const hours = Math.floor((arrival.getTime() - departure.getTime()) / (1000 * 60 * 60));
    return `${hours}h`;
  };

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DirectionsBoat color="primary" />
            <Typography variant="h6">{ride.shipName}</Typography>
          </Box>
          <Chip label={calculateDuration()} color="primary" size="small" />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" color="text.primary" gutterBottom>
            <strong>{ride.departurePort.name}</strong> → <strong>{ride.arrivalPort.name}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ride.departurePort.city}, {ride.departurePort.country} → {ride.arrivalPort.city}, {ride.arrivalPort.country}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">
              Departs: {formatDateTime(ride.departureTime)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">
              Arrives: {formatDateTime(ride.arrivalTime)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <EventSeat fontSize="small" color="action" />
            <Typography variant="body2">
              {ride.availableSeats} seats available
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AttachMoney fontSize="small" color="action" />
            <Typography variant="body2">
              ${ride.pricePerSeat} per passenger
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onSelect(ride)}
          disabled={ride.availableSeats === 0}
        >
          {ride.availableSeats === 0 ? 'Sold Out' : 'Select Cabin'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default RideCard;
