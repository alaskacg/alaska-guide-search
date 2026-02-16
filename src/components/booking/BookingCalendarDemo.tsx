/**
 * BookingCalendar Demo Page
 * 
 * A simple demo page to test the BookingCalendar component
 * Can be added to your router for quick testing
 */

import { useState } from 'react';
import { BookingCalendar, type AvailabilitySlot } from './BookingCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { CalendarDays, MapPin, User, DollarSign, Clock, Users } from 'lucide-react';

export function BookingCalendarDemo() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<AvailabilitySlot | null>(null);
  const [bookingStep, setBookingStep] = useState<'select' | 'confirm' | 'complete'>('select');

  const handleDateSelect = (date: Date, availability: AvailabilitySlot | null) => {
    setSelectedDate(date);
    setSelectedAvailability(availability);
    setBookingStep('select');
    
    // Log for debugging
    console.log('📅 Date Selected:', format(date, 'PPP'));
    console.log('📊 Availability:', availability);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedAvailability) return;
    
    console.log('✅ Booking Confirmed:', {
      date: selectedDate,
      availability: selectedAvailability,
    });
    
    setBookingStep('complete');
    
    // In production, you would:
    // 1. Create booking in database
    // 2. Process payment
    // 3. Send confirmation email
    // 4. Redirect to confirmation page
  };

  const handleNewBooking = () => {
    setSelectedDate(null);
    setSelectedAvailability(null);
    setBookingStep('select');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Alaska Fishing Adventure</h1>
              <p className="text-muted-foreground mt-1">Book your unforgettable experience</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Demo Mode
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Service Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Guide</div>
                  <div className="font-semibold">Captain Mike Johnson</div>
                  <div className="text-xs text-muted-foreground">25 years experience</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-semibold">Kenai River, Alaska</div>
                  <div className="text-xs text-muted-foreground">World-class fishing</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-semibold">Full Day (8 hours)</div>
                  <div className="text-xs text-muted-foreground">8:00 AM - 5:00 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="font-semibold">$250 per person</div>
                  <div className="text-xs text-muted-foreground">All equipment included</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <BookingCalendar
              serviceId="demo-fishing-tour-123"
              guideId="demo-guide-mike-456"
              onDateSelect={handleDateSelect}
              defaultPrice={250}
              className="w-full"
            />

            {/* What's Included */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Professional guide with 25+ years experience
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    All fishing equipment and tackle
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Fishing license included
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Lunch and refreshments
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Fish cleaning and packaging
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Safety equipment and life jackets
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {bookingStep === 'complete' ? (
                <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                  <CardHeader>
                    <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Booking Confirmed!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-green-800 dark:text-green-200">
                      Your booking has been confirmed. Check your email for details.
                    </div>
                    <Separator />
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Confirmation #</div>
                        <div className="font-mono font-semibold">AK-{Date.now().toString(36).toUpperCase()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Date</div>
                        <div className="font-semibold">
                          {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleNewBooking} className="w-full" variant="outline">
                      Book Another Date
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedDate && selectedAvailability ? (
                      <>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-muted-foreground">Selected Date</div>
                            <div className="font-semibold text-lg">
                              {format(selectedDate, 'EEEE')}
                            </div>
                            <div className="text-sm">
                              {format(selectedDate, 'MMMM d, yyyy')}
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-muted-foreground">Time</div>
                              <div className="text-sm font-medium">
                                {selectedAvailability.start_time}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">Duration</div>
                              <div className="text-sm font-medium">8 hours</div>
                            </div>
                          </div>

                          <div>
                            <div className="text-xs text-muted-foreground">Availability</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {selectedAvailability.available_spots} of {selectedAvailability.total_spots} spots available
                              </span>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Base Price</span>
                              <span className="font-medium">$250</span>
                            </div>
                            {selectedAvailability.price_override && (
                              <div className="flex justify-between text-sm">
                                <span className="text-amber-600">Special Pricing</span>
                                <span className="font-medium text-amber-600">
                                  -${(250 - selectedAvailability.price_override).toFixed(2)}
                                </span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                              <span>Total</span>
                              <span className="text-primary">
                                ${selectedAvailability.price_override || 250}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={handleConfirmBooking}
                          className="w-full"
                          size="lg"
                          disabled={
                            !selectedAvailability.is_available ||
                            selectedAvailability.available_spots === 0
                          }
                        >
                          {selectedAvailability.is_available && selectedAvailability.available_spots > 0
                            ? 'Confirm Booking'
                            : 'Not Available'}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                          Free cancellation up to 48 hours before departure
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground">
                          Select a date from the calendar to continue
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Reviews Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <p className="text-sm">"Best fishing trip ever! Captain Mike knows all the best spots."</p>
                    <p className="text-xs text-muted-foreground">- John D., 2 weeks ago</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-yellow-500">★</span>
                      ))}
                    </div>
                    <p className="text-sm">"Caught my first King Salmon! Amazing experience."</p>
                    <p className="text-xs text-muted-foreground">- Sarah M., 1 month ago</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingCalendarDemo;
