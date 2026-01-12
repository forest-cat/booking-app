import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import SearchForm from '../components/SearchForm';
import RideCard from '../components/RideCard';
import CabinSelector from '../components/CabinSelector';
import BookingForm from '../components/BookingForm';
import BookingConfirmation from '../components/BookingConfirmation';
import { usePorts, useSearchRides, useCabinsByRide, useCreateBooking } from '../api/hooks';
import { Ride, Cabin, RideSearchRequest, BookingRequest, Booking } from '../types';

const HomePage: React.FC = () => {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedCabin, setSelectedCabin] = useState<Cabin | null>(null);
  const [searchResults, setSearchResults] = useState<Ride[]>([]);
  const [showCabinSelector, setShowCabinSelector] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [searchParams, setSearchParams] = useState<RideSearchRequest | null>(null);

  const { data: ports, isLoading: portsLoading, error: portsError } = usePorts();
  const searchRides = useSearchRides();
  const { data: cabins, isLoading: cabinsLoading } = useCabinsByRide(selectedRide?.id || null);
  const createBooking = useCreateBooking();

  const handleSearch = async (searchRequest: RideSearchRequest) => {
    setSearchParams(searchRequest);
    setConfirmedBooking(null);
    const result = await searchRides.mutateAsync(searchRequest);
    setSearchResults(result);
  };

  const handleSelectRide = (ride: Ride) => {
    setSelectedRide(ride);
    setShowCabinSelector(true);
  };

  const handleSelectCabin = (cabin: Cabin) => {
    setSelectedCabin(cabin);
    setShowCabinSelector(false);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingRequest: BookingRequest) => {
    try {
      const booking = await createBooking.mutateAsync(bookingRequest);
      setConfirmedBooking(booking);
      setShowBookingForm(false);
      setSearchResults([]);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  if (portsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (portsError || !ports) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          Failed to load ports. Please check if the backend is running.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Ferry Booking System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Search and book your ferry rides across the ocean
        </Typography>
      </Box>

      {!confirmedBooking && (
        <SearchForm
          ports={ports}
          onSearch={handleSearch}
          loading={searchRides.isPending}
        />
      )}

      {searchRides.isPending && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {searchRides.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to search rides. Please try again.
        </Alert>
      )}

      {confirmedBooking ? (
        <BookingConfirmation booking={confirmedBooking} />
      ) : (
        <>
          {searchResults.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Available Rides ({searchResults.length})
              </Typography>
              <Grid container spacing={2}>
                {searchResults.map((ride) => (
                  <Grid item xs={12} key={ride.id}>
                    <RideCard ride={ride} onSelect={handleSelectRide} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {searchResults.length === 0 && searchRides.isSuccess && (
            <Alert severity="info">
              No rides found for your search criteria. Please try different dates or ports.
            </Alert>
          )}
        </>
      )}

      <CabinSelector
        open={showCabinSelector}
        ride={selectedRide}
        cabins={cabins || []}
        loading={cabinsLoading}
        onClose={() => setShowCabinSelector(false)}
        onSelect={handleSelectCabin}
      />

      <BookingForm
        open={showBookingForm}
        ride={selectedRide}
        cabin={selectedCabin}
        passengers={searchParams?.passengers || 1}
        onClose={() => setShowBookingForm(false)}
        onSubmit={handleBookingSubmit}
        loading={createBooking.isPending}
      />
    </Container>
  );
};

export default HomePage;
