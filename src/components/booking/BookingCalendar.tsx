import { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, isSameDay, isBefore, startOfDay, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, DollarSign, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: AvailabilitySlot;
  availabilityStatus: 'available' | 'limited' | 'booked' | 'unavailable';
}

export interface BookingCalendarProps {
  serviceId: string;
  guideId: string;
  onDateSelect: (date: Date, availability: AvailabilitySlot | null) => void;
  className?: string;
  defaultPrice?: number;
  // Optional: provide custom data fetcher (useful for testing or non-Supabase backends)
  fetchAvailability?: (params: {
    serviceId: string;
    guideId: string;
    startDate: Date;
    endDate: Date;
  }) => Promise<AvailabilitySlot[]>;
}

export type { AvailabilitySlot };

// Mock data generator for testing without Supabase
const generateMockAvailability = async (params: {
  serviceId: string;
  guideId: string;
  startDate: Date;
  endDate: Date;
}): Promise<AvailabilitySlot[]> => {
  const { startDate, endDate } = params;
  const slots: AvailabilitySlot[] = [];
  
  // Generate availability for weekdays
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    // Skip Sundays (0) and Mondays (1) as "unavailable"
    if (dayOfWeek !== 0 && dayOfWeek !== 1) {
      const baseAvailability: AvailabilitySlot = {
        id: `mock-${currentDate.toISOString()}`,
        date: new Date(currentDate),
        start_time: '08:00',
        end_time: '17:00',
        available_spots: 6,
        total_spots: 6,
        is_available: true,
        booking_count: 0,
      };

      // Add some variety
      if (dayOfWeek === 6) { // Saturday - higher demand
        baseAvailability.booking_count = Math.floor(Math.random() * 4);
        baseAvailability.price_override = 300; // Weekend premium
      } else if (currentDate.getDate() % 5 === 0) {
        baseAvailability.booking_count = Math.floor(Math.random() * 3);
      }

      slots.push(baseAvailability);
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return slots;
};

export function BookingCalendar({
  serviceId,
  guideId,
  onDateSelect,
  className,
  defaultPrice = 0,
  fetchAvailability,
}: BookingCalendarProps) {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch availability data (Supabase or custom fetcher)
  const {
    data: availabilityData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['availability', serviceId, guideId, date.getMonth(), date.getFullYear()],
    queryFn: async () => {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      // Use custom fetcher if provided, otherwise try Supabase, fallback to mock
      if (fetchAvailability) {
        return fetchAvailability({ serviceId, guideId, startDate, endDate });
      }

      // Try to use Supabase if available
      try {
        // Dynamic import to avoid errors if @/lib/supabase doesn't exist
        const { supabase } = await import('@/lib/supabase').catch(() => ({ supabase: null }));
        
        if (supabase) {
          const { data, error } = await supabase
            .from('service_availability')
            .select(`
              *,
              bookings:service_bookings(count)
            `)
            .eq('service_id', serviceId)
            .eq('guide_id', guideId)
            .gte('date', startDate.toISOString().split('T')[0])
            .lte('date', endDate.toISOString().split('T')[0])
            .order('date', { ascending: true });

          if (error) throw error;

          return (data || []).map((slot: any) => ({
            id: slot.id,
            date: new Date(slot.date),
            start_time: slot.start_time,
            end_time: slot.end_time,
            available_spots: slot.available_spots,
            total_spots: slot.total_spots,
            price_override: slot.price_override,
            is_available: slot.is_available,
            booking_count: slot.bookings?.[0]?.count || 0,
          })) as AvailabilitySlot[];
        }
      } catch (err) {
        console.warn('Supabase not available, using mock data:', err);
      }

      // Fallback to mock data
      return generateMockAvailability({ serviceId, guideId, startDate, endDate });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Convert availability data to calendar events
  const events = useMemo<CalendarEvent[]>(() => {
    if (!availabilityData) return [];

    return availabilityData.map((slot) => {
      const [startHour, startMinute] = slot.start_time.split(':').map(Number);
      const [endHour, endMinute] = slot.end_time.split(':').map(Number);

      const start = new Date(slot.date);
      start.setHours(startHour, startMinute, 0, 0);

      const end = new Date(slot.date);
      end.setHours(endHour, endMinute, 0, 0);

      const bookedSpots = slot.booking_count || 0;
      const availableSpots = slot.available_spots - bookedSpots;
      const percentAvailable = (availableSpots / slot.total_spots) * 100;

      let availabilityStatus: CalendarEvent['availabilityStatus'];
      if (!slot.is_available || availableSpots <= 0) {
        availabilityStatus = 'unavailable';
      } else if (bookedSpots > 0) {
        availabilityStatus = 'booked';
      } else if (percentAvailable <= 30) {
        availabilityStatus = 'limited';
      } else {
        availabilityStatus = 'available';
      }

      return {
        id: slot.id,
        title: `${availableSpots}/${slot.total_spots} spots`,
        start,
        end,
        resource: { ...slot, booking_count: bookedSpots },
        availabilityStatus,
      };
    });
  }, [availabilityData]);

  // Get availability for a specific date
  const getDateAvailability = useCallback(
    (targetDate: Date): AvailabilitySlot | null => {
      if (!availabilityData) return null;

      const found = availabilityData.find((slot) =>
        isSameDay(slot.date, targetDate)
      );

      if (!found) return null;

      const bookedSpots = found.booking_count || 0;
      return {
        ...found,
        available_spots: found.available_spots - bookedSpots,
      };
    },
    [availabilityData]
  );

  // Handle date selection
  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      const selectedDate = startOfDay(slotInfo.start);
      
      // Don't allow past dates
      if (isBefore(selectedDate, startOfDay(new Date()))) {
        return;
      }

      setSelectedDate(selectedDate);
      const availability = getDateAvailability(selectedDate);
      onDateSelect(selectedDate, availability);
    },
    [getDateAvailability, onDateSelect]
  );

  // Handle event click
  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      const selectedDate = startOfDay(event.start);
      setSelectedDate(selectedDate);
      onDateSelect(selectedDate, event.resource);
    },
    [onDateSelect]
  );

  // Custom event styling
  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const baseStyle = {
      borderRadius: '4px',
      border: 'none',
      fontSize: '0.75rem',
      fontWeight: 500,
      padding: '2px 4px',
    };

    const styles = {
      available: {
        backgroundColor: '#10b981',
        color: '#ffffff',
      },
      limited: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
      },
      booked: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
      },
      unavailable: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
      },
    };

    return {
      style: {
        ...baseStyle,
        ...styles[event.availabilityStatus],
      },
    };
  }, []);

  // Custom day styling
  const dayPropGetter = useCallback(
    (date: Date) => {
      const today = startOfDay(new Date());
      const dayStart = startOfDay(date);

      const isPast = isBefore(dayStart, today);
      const isToday = isSameDay(dayStart, today);
      const isSelected = selectedDate && isSameDay(dayStart, selectedDate);

      let className = '';
      if (isPast) {
        className = 'rbc-off-range-bg opacity-40 cursor-not-allowed';
      } else if (isSelected) {
        className = 'bg-primary/10 border-2 border-primary';
      } else if (isToday) {
        className = 'bg-blue-50 dark:bg-blue-950';
      }

      return {
        className,
      };
    },
    [selectedDate]
  );

  // Custom toolbar
  const CustomToolbar = ({ label, onNavigate }: any) => (
    <div className="flex items-center justify-between mb-4 pb-4 border-b">
      <div className="flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onNavigate('PREV');
            setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date();
            onNavigate('TODAY');
            setDate(today);
          }}
        >
          Today
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onNavigate('NEXT');
            setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
          }}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load availability data'}
            </AlertDescription>
          </Alert>
          <Button onClick={() => refetch()} className="mt-4" variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Select Your Date
        </CardTitle>
        <CardDescription>
          Click on an available date to view details and book
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-500" />
            <span className="text-xs text-muted-foreground">Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-xs text-muted-foreground">Partially Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-xs text-muted-foreground">Unavailable</span>
          </div>
        </div>

        {/* Calendar */}
        <div className="booking-calendar-container">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            dayPropGetter={dayPropGetter}
            components={{
              toolbar: CustomToolbar,
            }}
            style={{ height: 600 }}
            className="rounded-lg border"
            views={['month', 'week', 'day']}
            step={60}
            showMultiDayTimes
            popup
          />
        </div>

        {/* Selected Date Info */}
        {selectedDate && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h4>
              {getDateAvailability(selectedDate) && (
                <Badge
                  variant={
                    getDateAvailability(selectedDate)!.is_available &&
                    getDateAvailability(selectedDate)!.available_spots > 0
                      ? 'default'
                      : 'destructive'
                  }
                >
                  {getDateAvailability(selectedDate)!.is_available &&
                  getDateAvailability(selectedDate)!.available_spots > 0
                    ? 'Available'
                    : 'Fully Booked'}
                </Badge>
              )}
            </div>

            {getDateAvailability(selectedDate) ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Time</div>
                    <div className="font-medium">
                      {getDateAvailability(selectedDate)!.start_time} -{' '}
                      {getDateAvailability(selectedDate)!.end_time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Available Spots</div>
                    <div className="font-medium">
                      {getDateAvailability(selectedDate)!.available_spots} /{' '}
                      {getDateAvailability(selectedDate)!.total_spots}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Price</div>
                    <div className="font-medium">
                      ${getDateAvailability(selectedDate)!.price_override || defaultPrice}
                      {getDateAvailability(selectedDate)!.price_override && (
                        <span className="text-xs text-amber-600 ml-1">(Special)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No availability information for this date. Please contact the guide directly.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* No availability message */}
        {!isLoading && availabilityData?.length === 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No availability set for this month. Please check other months or contact the guide.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <style>{`
        .booking-calendar-container {
          --rbc-border-color: hsl(var(--border));
          --rbc-text-color: hsl(var(--foreground));
        }

        .rbc-calendar {
          font-family: inherit;
        }

        .rbc-header {
          padding: 10px 4px;
          font-weight: 600;
          font-size: 0.875rem;
          color: hsl(var(--muted-foreground));
          border-bottom: 1px solid var(--rbc-border-color);
        }

        .rbc-today {
          background-color: hsl(var(--accent));
        }

        .rbc-off-range {
          color: hsl(var(--muted-foreground));
          opacity: 0.5;
        }

        .rbc-date-cell {
          padding: 4px;
          text-align: right;
        }

        .rbc-event {
          cursor: pointer;
        }

        .rbc-event:hover {
          opacity: 0.85;
        }

        .rbc-month-view {
          border: 1px solid var(--rbc-border-color);
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .rbc-day-bg {
          cursor: pointer;
        }

        .rbc-day-bg:hover:not(.rbc-off-range-bg) {
          background-color: hsl(var(--accent));
        }

        .rbc-selected-cell {
          background-color: hsl(var(--primary) / 0.1);
        }

        @media (max-width: 640px) {
          .rbc-calendar {
            font-size: 0.75rem;
          }

          .rbc-header {
            padding: 6px 2px;
            font-size: 0.75rem;
          }

          .rbc-event {
            padding: 1px 2px;
            font-size: 0.625rem;
          }

          .booking-calendar-container .rbc-calendar {
            height: 500px !important;
          }
        }
      `}</style>
    </Card>
  );
}

export default BookingCalendar;
