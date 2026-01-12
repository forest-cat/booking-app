import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portsApi, ridesApi, cabinsApi, bookingsApi } from './services';
import { RideSearchRequest, BookingRequest } from '../types';

// Ports hooks
export const usePorts = () => {
  return useQuery({
    queryKey: ['ports'],
    queryFn: async () => {
      const response = await portsApi.getAll();
      return response.data;
    },
  });
};

// Rides hooks
export const useSearchRides = () => {
  return useMutation({
    mutationFn: async (searchRequest: RideSearchRequest) => {
      const response = await ridesApi.search(searchRequest);
      return response.data;
    },
  });
};

// Cabins hooks
export const useCabinsByRide = (rideId: number | null) => {
  return useQuery({
    queryKey: ['cabins', rideId],
    queryFn: async () => {
      if (!rideId) return [];
      const response = await cabinsApi.getByRideId(rideId);
      return response.data;
    },
    enabled: !!rideId,
  });
};

// Bookings hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingRequest: BookingRequest) => {
      const response = await bookingsApi.create(bookingRequest);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useBooking = (reference: string | null) => {
  return useQuery({
    queryKey: ['booking', reference],
    queryFn: async () => {
      if (!reference) return null;
      const response = await bookingsApi.getByReference(reference);
      return response.data;
    },
    enabled: !!reference,
  });
};

export const useCustomerBookings = (customerId: number | null) => {
  return useQuery({
    queryKey: ['bookings', 'customer', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const response = await bookingsApi.getByCustomerId(customerId);
      return response.data;
    },
    enabled: !!customerId,
  });
};
