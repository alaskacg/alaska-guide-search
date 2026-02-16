/**
 * Copy-Paste Examples for BookingCalendar
 * 
 * Use these examples to quickly integrate the BookingCalendar
 * component into your application.
 */

// ============================================
// EXAMPLE 1: Basic Usage (Minimal)
// ============================================

import { BookingCalendar } from '@/components/booking';

export function BasicBooking() {
  return (
    <BookingCalendar
      serviceId="fishing-tour-123"
      guideId="guide-456"
      onDateSelect={(date, availability) => {
        console.log('Selected date:', date);
        console.log('Availability:', availability);
      }}
      defaultPrice={250}
    />
  );
}

// ============================================
// EXAMPLE 2: With State Management
// ============================================

import { BookingCalendar } from '@/components/booking';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function BookingWithState() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState(null);

  const handleProceed = () => {
    if (selectedDate && availability) {
      // Navigate to checkout or show booking modal
      console.log('Proceeding with booking:', { selectedDate, availability });
    }
  };

  return (
    <div className="space-y-4">
      <BookingCalendar
        serviceId="fishing-tour-123"
        guideId="guide-456"
        onDateSelect={(date, avail) => {
          setSelectedDate(date);
          setAvailability(avail);
        }}
        defaultPrice={250}
      />
      
      {selectedDate && availability && (
        <Button onClick={handleProceed} className="w-full">
          Book {availability.available_spots} spot(s) for ${availability.price_override || 250}
        </Button>
      )}
    </div>
  );
}

// ============================================
// EXAMPLE 3: With Custom API Backend
// ============================================

import { BookingCalendar } from '@/components/booking';

export function BookingWithCustomAPI() {
  const fetchAvailability = async ({ serviceId, guideId, startDate, endDate }) => {
    // Replace with your API endpoint
    const response = await fetch(
      `/api/v1/availability?service=${serviceId}&guide=${guideId}&from=${startDate.toISOString()}&to=${endDate.toISOString()}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }

    const data = await response.json();

    // Transform your API response to match the expected format
    return data.slots.map(slot => ({
      id: slot.id,
      date: new Date(slot.date),
      start_time: slot.time.start,
      end_time: slot.time.end,
      available_spots: slot.capacity.available,
      total_spots: slot.capacity.total,
      price_override: slot.pricing.special,
      is_available: slot.status === 'available',
      booking_count: slot.bookings || 0,
    }));
  };

  return (
    <BookingCalendar
      serviceId="fishing-tour-123"
      guideId="guide-456"
      onDateSelect={(date, availability) => {
        console.log('Selected:', { date, availability });
      }}
      defaultPrice={250}
      fetchAvailability={fetchAvailability}
    />
  );
}

// ============================================
// EXAMPLE 4: Full Page Integration
// ============================================

import { BookingCalendar } from '@/components/booking';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export function ServiceBookingPage() {
  const { serviceId, guideId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState(null);

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        serviceId,
        guideId,
        date: selectedDate,
        availability,
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book Your Adventure</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <BookingCalendar
            serviceId={serviceId}
            guideId={guideId}
            onDateSelect={(date, avail) => {
              setSelectedDate(date);
              setAvailability(avail);
            }}
            defaultPrice={250}
          />
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate && availability ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div className="font-semibold">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Available Spots</div>
                    <div className="font-semibold">
                      {availability.available_spots} of {availability.total_spots}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="text-2xl font-bold">
                      ${availability.price_override || 250}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCheckout} 
                    className="w-full"
                    disabled={!availability.is_available || availability.available_spots === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Select a date to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 5: Add to React Router
// ============================================

// In your router configuration (e.g., App.tsx or routes.tsx):

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingCalendarDemo } from '@/components/booking/BookingCalendarDemo';
import { ServiceBookingPage } from './path/to/ServiceBookingPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Demo page - for testing */}
        <Route path="/booking-demo" element={<BookingCalendarDemo />} />
        
        {/* Actual booking page */}
        <Route path="/services/:serviceId/guides/:guideId/book" element={<ServiceBookingPage />} />
        
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}

// ============================================
// EXAMPLE 6: With React Query Provider
// ============================================

// Make sure your app has React Query provider:

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookingCalendar } from '@/components/booking';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <BookingCalendar
        serviceId="123"
        guideId="456"
        onDateSelect={(date, availability) => {}}
        defaultPrice={250}
      />
    </QueryClientProvider>
  );
}

// ============================================
// EXAMPLE 7: Multiple Services on One Page
// ============================================

import { BookingCalendar } from '@/components/booking';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function MultiServiceBooking({ guideId }) {
  const services = [
    { id: 'fishing-half', name: 'Half Day Fishing', price: 150 },
    { id: 'fishing-full', name: 'Full Day Fishing', price: 250 },
    { id: 'fishing-multi', name: 'Multi-Day Trip', price: 500 },
  ];

  return (
    <Tabs defaultValue={services[0].id}>
      <TabsList className="grid w-full grid-cols-3">
        {services.map(service => (
          <TabsTrigger key={service.id} value={service.id}>
            {service.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {services.map(service => (
        <TabsContent key={service.id} value={service.id}>
          <BookingCalendar
            serviceId={service.id}
            guideId={guideId}
            onDateSelect={(date, availability) => {
              console.log(`Booked ${service.name}:`, { date, availability });
            }}
            defaultPrice={service.price}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

// ============================================
// EXAMPLE 8: With Loading Overlay
// ============================================

import { BookingCalendar } from '@/components/booking';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function BookingWithLoading() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDateSelect = async (date, availability) => {
    setIsProcessing(true);
    
    try {
      // Simulate API call or processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Booking selected:', { date, availability });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      
      <BookingCalendar
        serviceId="123"
        guideId="456"
        onDateSelect={handleDateSelect}
        defaultPrice={250}
      />
    </div>
  );
}

// ============================================
// QUICK TIPS
// ============================================

/*
1. IMPORT: Always import from the barrel export
   ✅ import { BookingCalendar } from '@/components/booking';
   ❌ import BookingCalendar from '@/components/booking/BookingCalendar';

2. REACT QUERY: Component requires React Query provider in parent tree
   - Usually in App.tsx or layout component

3. DATE HANDLING: Dates are JavaScript Date objects
   - Use date-fns for formatting: format(date, 'PPP')

4. AVAILABILITY: Can be null if no data for selected date
   - Always check: if (availability && availability.is_available)

5. STYLING: Component uses shadcn/ui theme
   - Customize via CSS variables in your globals.css

6. MOBILE: Fully responsive out of the box
   - Test on different screen sizes

7. MOCK DATA: Works without backend
   - Perfect for development and demos

8. ERRORS: Component handles errors gracefully
   - Check browser console for detailed error messages
*/
