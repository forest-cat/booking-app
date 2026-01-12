import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { MeetingRoom, People, AttachMoney } from '@mui/icons-material';
import { Cabin, Ride } from '../types';

interface CabinSelectorProps {
  open: boolean;
  ride: Ride | null;
  cabins: Cabin[];
  loading: boolean;
  onClose: () => void;
  onSelect: (cabin: Cabin) => void;
}

const CabinSelector: React.FC<CabinSelectorProps> = ({
  open,
  ride,
  cabins,
  loading,
  onClose,
  onSelect,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Select a Cabin
        {ride && (
          <Typography variant="subtitle2" color="text.secondary">
            {ride.shipName} - {ride.departurePort.name} to {ride.arrivalPort.name}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : cabins.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
            No available cabins for this ride
          </Typography>
        ) : (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {cabins.map((cabin) => (
              <Grid item xs={12} sm={6} key={cabin.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { boxShadow: 4 },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {cabin.cabinNumber}
                      </Typography>
                      <Chip label={cabin.type} color="primary" size="small" />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <MeetingRoom fontSize="small" color="action" />
                        <Typography variant="body2">{cabin.type}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <People fontSize="small" color="action" />
                        <Typography variant="body2">Up to {cabin.capacity}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 2 }}>
                      <AttachMoney fontSize="small" color="success" />
                      <Typography variant="h6" color="success.main">
                        ${cabin.price.toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => onSelect(cabin)}
                      disabled={!cabin.available}
                    >
                      {cabin.available ? 'Book This Cabin' : 'Not Available'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CabinSelector;
