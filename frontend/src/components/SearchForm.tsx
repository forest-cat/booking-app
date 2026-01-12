import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Port, RideSearchRequest } from '../types';
import { SearchOutlined } from '@mui/icons-material';

interface SearchFormProps {
  ports: Port[];
  onSearch: (searchRequest: RideSearchRequest) => void;
  loading?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ ports, onSearch, loading }) => {
  const [departurePortId, setDeparturePortId] = useState<number | ''>('');
  const [arrivalPortId, setArrivalPortId] = useState<number | ''>('');
  const [departureTime, setDepartureTime] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (departurePortId && arrivalPortId && departureTime) {
      onSearch({
        departurePortId: Number(departurePortId),
        arrivalPortId: Number(arrivalPortId),
        departureTime,
        passengers,
      });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Search Ferry Rides
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Departure Port"
              value={departurePortId}
              onChange={(e) => setDeparturePortId(Number(e.target.value))}
              required
            >
              {ports.map((port) => (
                <MenuItem key={port.id} value={port.id}>
                  {port.name} ({port.code})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Arrival Port"
              value={arrivalPortId}
              onChange={(e) => setArrivalPortId(Number(e.target.value))}
              required
            >
              {ports.map((port) => (
                <MenuItem key={port.id} value={port.id}>
                  {port.name} ({port.code})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Departure Time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Passengers"
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              inputProps={{ min: 1, max: 10 }}
              required
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={<SearchOutlined />}
              sx={{ height: '56px' }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SearchForm;
