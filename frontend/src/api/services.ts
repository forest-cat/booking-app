import apiClient from './client';
import { Port, Ride, Cabin, Booking, RideSearchRequest, BookingRequest } from '../types';

export const portsApi = {
  getAll: () => apiClient.get<Port[]>('/ports'),
  getById: (id: number) => apiClient.get<Port>(`/ports/${id}`),
  getByCode: (code: string) => apiClient.get<Port>(`/ports/code/${code}`),
};

export const ridesApi = {
  getAll: () => apiClient.get<Ride[]>('/rides'),
  getById: (id: number) => apiClient.get<Ride>(`/rides/${id}`),
  search: (searchRequest: RideSearchRequest) => 
    apiClient.post<Ride[]>('/rides/search', searchRequest),
};

export const cabinsApi = {
  getAll: () => apiClient.get<Cabin[]>('/cabins'),
  getById: (id: number) => apiClient.get<Cabin>(`/cabins/${id}`),
  getByRideId: (rideId: number) => 
    apiClient.get<Cabin[]>(`/cabins/ride/${rideId}`),
};

export const bookingsApi = {
  create: (bookingRequest: BookingRequest) => 
    apiClient.post<Booking>('/bookings', bookingRequest),
  getByReference: (reference: string) => 
    apiClient.get<Booking>(`/bookings/${reference}`),
  getByCustomerId: (customerId: number) => 
    apiClient.get<Booking[]>(`/bookings/customer/${customerId}`),
};
