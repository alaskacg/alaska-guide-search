import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Booking,
  BookingWithDetails,
  BookingFormData,
  BookingStatus,
  PaymentType,
} from '../types/booking';

// Query Keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: { userId?: string; guideId?: string }) => 
    [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

// API Functions
async function fetchBookings(userId?: string, guideId?: string): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('client_id', userId);
  }
  if (guideId) {
    query = query.eq('guide_id', guideId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Booking[];
}

async function fetchBooking(id: string): Promise<BookingWithDetails> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      guide:guides!bookings_guide_id_fkey(*),
      service:guide_services!bookings_service_id_fkey(*),
      client:profiles!bookings_client_id_fkey(*),
      payments:booking_payments(*),
      review:reviews(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as BookingWithDetails;
}

async function createBooking(formData: BookingFormData): Promise<Booking> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch service details for pricing
  const { data: service, error: serviceError } = await supabase
    .from('guide_services')
    .select('price_per_person, deposit_percentage, duration_hours')
    .eq('id', formData.service_id)
    .single();

  if (serviceError) throw serviceError;

  const totalPrice = service.price_per_person * formData.participants;
  const depositAmount = service.deposit_percentage 
    ? totalPrice * (service.deposit_percentage / 100)
    : undefined;

  const amountPaid = formData.payment_type === PaymentType.FULL 
    ? totalPrice 
    : depositAmount || 0;

  // Generate booking number
  const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const bookingData = {
    booking_number: bookingNumber,
    client_id: user.id,
    guide_id: formData.guide_id,
    service_id: formData.service_id,
    status: BookingStatus.PENDING,
    start_date: formData.start_date,
    end_date: formData.start_date, // Can be calculated based on duration
    start_time: formData.start_time,
    participants: formData.participants,
    total_price: totalPrice,
    deposit_amount: depositAmount,
    amount_paid: amountPaid,
    amount_due: totalPrice - amountPaid,
    payment_type: formData.payment_type,
    client_details: {
      name: formData.client_name,
      email: formData.client_email,
      phone: formData.client_phone,
      emergency_contact: formData.emergency_contact,
    },
    participant_details: formData.participant_details,
    special_requests: formData.special_requests,
    pickup_location: formData.pickup_location,
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
  notes?: string
): Promise<Booking> {
  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === BookingStatus.CONFIRMED) {
    updates.confirmed_at = new Date().toISOString();
  } else if (status === BookingStatus.COMPLETED) {
    updates.completed_at = new Date().toISOString();
  }

  if (notes) {
    updates.guide_notes = notes;
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

async function cancelBooking(
  bookingId: string,
  reason: string
): Promise<{ booking: Booking; refundAmount: number }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Fetch booking details
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, guide:guides!bookings_guide_id_fkey(cancellation_policy)')
    .eq('id', bookingId)
    .single();

  if (fetchError) throw fetchError;

  // Calculate refund based on cancellation policy and time until booking
  const startDate = new Date(booking.start_date);
  const now = new Date();
  const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

  let refundPercentage = 0;
  const policy = (booking.guide as any)?.cancellation_policy || 'moderate';

  // Simplified refund logic based on policy
  if (policy === 'flexible') {
    refundPercentage = hoursUntilStart >= 24 ? 100 : 50;
  } else if (policy === 'moderate') {
    if (hoursUntilStart >= 168) refundPercentage = 100; // 7 days
    else if (hoursUntilStart >= 48) refundPercentage = 50;
    else refundPercentage = 0;
  } else if (policy === 'strict') {
    if (hoursUntilStart >= 336) refundPercentage = 100; // 14 days
    else if (hoursUntilStart >= 168) refundPercentage = 50;
    else refundPercentage = 0;
  } else if (policy === 'super_strict') {
    refundPercentage = hoursUntilStart >= 720 ? 50 : 0; // 30 days
  }

  const refundAmount = (booking.amount_paid * refundPercentage) / 100;
  const cancellationFee = booking.amount_paid - refundAmount;

  const updates = {
    status: BookingStatus.CANCELLED,
    cancellation_requested_at: new Date().toISOString(),
    cancellation_reason: reason,
    cancelled_by: user.id,
    cancellation_fee: cancellationFee,
    refund_amount: refundAmount,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return { booking: data as Booking, refundAmount };
}

async function checkIn(bookingId: string): Promise<Booking> {
  const updates = {
    status: BookingStatus.IN_PROGRESS,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

// Hooks

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      toast({
        title: 'Booking Created',
        description: `Your booking ${data.booking_number} has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Booking Failed',
        description: error.message || 'Failed to create booking. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to fetch bookings with optional filters
 */
export function useBookings(userId?: string, guideId?: string) {
  return useQuery({
    queryKey: bookingKeys.list({ userId, guideId }),
    queryFn: () => fetchBookings(userId, guideId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single booking with full details
 */
export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: () => fetchBooking(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to update booking status
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ 
      bookingId, 
      status, 
      notes 
    }: { 
      bookingId: string; 
      status: BookingStatus; 
      notes?: string;
    }) => updateBookingStatus(bookingId, status, notes),
    onMutate: async ({ bookingId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookingKeys.detail(bookingId) });

      // Snapshot previous value
      const previousBooking = queryClient.getQueryData(bookingKeys.detail(bookingId));

      // Optimistically update
      queryClient.setQueryData(
        bookingKeys.detail(bookingId),
        (old: BookingWithDetails | undefined) => 
          old ? { ...old, status } : old
      );

      return { previousBooking };
    },
    onSuccess: (data, { bookingId }) => {
      queryClient.setQueryData(bookingKeys.detail(bookingId), data);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      toast({
        title: 'Status Updated',
        description: `Booking status updated to ${data.status}.`,
      });
    },
    onError: (error: Error, { bookingId }, context) => {
      // Rollback on error
      if (context?.previousBooking) {
        queryClient.setQueryData(bookingKeys.detail(bookingId), context.previousBooking);
      }
      
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update booking status.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to cancel a booking with refund calculation
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ 
      bookingId, 
      reason 
    }: { 
      bookingId: string; 
      reason: string;
    }) => cancelBooking(bookingId, reason),
    onSuccess: ({ booking, refundAmount }, { bookingId }) => {
      queryClient.setQueryData(bookingKeys.detail(bookingId), booking);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      toast({
        title: 'Booking Cancelled',
        description: refundAmount > 0 
          ? `Your booking has been cancelled. Refund amount: $${refundAmount.toFixed(2)}`
          : 'Your booking has been cancelled.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel booking. Please try again.',
        variant: 'destructive',
      });
    },
  });
}

/**
 * Hook to check in to a booking
 */
export function useCheckIn() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (bookingId: string) => checkIn(bookingId),
    onMutate: async (bookingId) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.detail(bookingId) });

      const previousBooking = queryClient.getQueryData(bookingKeys.detail(bookingId));

      queryClient.setQueryData(
        bookingKeys.detail(bookingId),
        (old: BookingWithDetails | undefined) => 
          old ? { ...old, status: BookingStatus.IN_PROGRESS } : old
      );

      return { previousBooking };
    },
    onSuccess: (data, bookingId) => {
      queryClient.setQueryData(bookingKeys.detail(bookingId), data);
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      
      toast({
        title: 'Check-in Successful',
        description: 'You have been checked in to your booking.',
      });
    },
    onError: (error: Error, bookingId, context) => {
      if (context?.previousBooking) {
        queryClient.setQueryData(bookingKeys.detail(bookingId), context.previousBooking);
      }
      
      toast({
        title: 'Check-in Failed',
        description: error.message || 'Failed to check in. Please try again.',
        variant: 'destructive',
      });
    },
  });
}
