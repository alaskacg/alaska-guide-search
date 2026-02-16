/**
 * Example usage of BookingCalendar component
 * 
 * This file demonstrates how to integrate the BookingCalendar
 * into your booking flow.
 */

import { useState } from 'react';
import { BookingCalendar } from './BookingCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface AvailabilitySlot {
  id: string;
  date: Date;
  start_time: string;
  end_time: string;
  available_spots: number;
  total_spots: number;
  price_override?: number;
  is_available: boolean;
  booking_count?: number;
}

export function BookingCalendarExample() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilitySlot | null>(null);

  const handleDateSelect = (date: Date, availability: AvailabilitySlot | null) => {
    setSelectedDate(date);
    setSelectedAvailability(availability);
    console.log('Selected date:', date);
    console.log('Availability:', availability);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedAvailability) return;
    
    // Implement your booking logic here
    console.log('Proceeding with booking for:', {
      date: selectedDate,
      availability: selectedAvailability,
    });
    
    // Example: Navigate to checkout or open booking modal
    // navigate('/checkout', { state: { date: selectedDate, availability: selectedAvailability } });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Book Your Adventure</h1>
        <p className="text-muted-foreground">
          Select your preferred date from the calendar below
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <BookingCalendar
            serviceId="example-service-123"
            guideId="example-guide-456"
            onDateSelect={handleDateSelect}
            defaultPrice={250}
            className="w-full"
          />
        </div>

        {/* Booking Summary - takes 1 column */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDate && selectedAvailability ? (
                <>
                  <div>
                    <div className="text-sm text-muted-foreground">Selected Date</div>
                    <div className="font-semibold">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div className="font-semibold">
                      {selectedAvailability.start_time} - {selectedAvailability.end_time}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Available Spots</div>
                    <div className="font-semibold">
                      {selectedAvailability.available_spots} of {selectedAvailability.total_spots}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${selectedAvailability.price_override || 250}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleBooking} 
                    className="w-full"
                    disabled={!selectedAvailability.is_available || selectedAvailability.available_spots === 0}
                  >
                    {selectedAvailability.is_available && selectedAvailability.available_spots > 0
                      ? 'Proceed to Booking'
                      : 'Not Available'}
                  </Button>
                </>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a date to view details
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * Example with custom data fetcher (for non-Supabase backends)
 */
export function BookingCalendarWithCustomFetcher() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilitySlot | null>(null);

  // Custom fetch function that hits your own API
  const customFetchAvailability = async (params: {
    serviceId: string;
    guideId: string;
    startDate: Date;
    endDate: Date;
  }) => {
    const response = await fetch(
      `/api/availability?serviceId=${params.serviceId}&guideId=${params.guideId}&start=${params.startDate.toISOString()}&end=${params.endDate.toISOString()}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }
    
    const data = await response.json();
    
    // Transform your API response to match the expected format
    return data.map((slot: any) => ({
      id: slot.id,
      date: new Date(slot.date),
      start_time: slot.startTime,
      end_time: slot.endTime,
      available_spots: slot.availableSpots,
      total_spots: slot.totalSpots,
      price_override: slot.specialPrice,
      is_available: slot.isAvailable,
      booking_count: slot.bookingCount || 0,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BookingCalendar
        serviceId="example-service-123"
        guideId="example-guide-456"
        onDateSelect={(date, availability) => {
          setSelectedDate(date);
          setSelectedAvailability(availability);
        }}
        defaultPrice={250}
        fetchAvailability={customFetchAvailability}
      />
    </div>
  );
}

export default BookingCalendarExample;
