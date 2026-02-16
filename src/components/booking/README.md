# BookingCalendar Component

A full-featured, production-ready availability calendar component for the Alaska Guide Search platform, built with React, TypeScript, and react-big-calendar.

## Features

✅ **Service Availability Display** - Shows available, limited, booked, and unavailable dates  
✅ **Interactive Date Selection** - Click any date to view details and select for booking  
✅ **Availability Slots** - Display available/booked spots with real-time data  
✅ **Price Overrides** - Show special pricing for specific dates  
✅ **Mobile Responsive** - Optimized for all screen sizes  
✅ **shadcn/ui Styling** - Consistent with your design system  
✅ **Supabase Integration** - Ready for production with Supabase backend  
✅ **Mock Data Support** - Works without Supabase for testing/development  
✅ **Custom Data Fetcher** - Integrate with any backend API  
✅ **Loading States** - Skeleton loaders for better UX  
✅ **Error Handling** - Comprehensive error states with retry functionality  
✅ **TypeScript** - Full type safety throughout  

## Installation

The component requires these dependencies (already in package.json):

```bash
npm install react-big-calendar date-fns @tanstack/react-query
npm install --save-dev @types/react-big-calendar
```

## Basic Usage

```tsx
import { BookingCalendar } from '@/components/booking';
import { useState } from 'react';

function MyBookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState(null);

  return (
    <BookingCalendar
      serviceId="fishing-tour-123"
      guideId="guide-456"
      onDateSelect={(date, availability) => {
        setSelectedDate(date);
        setAvailability(availability);
      }}
      defaultPrice={250}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `serviceId` | `string` | Yes | Unique identifier for the service |
| `guideId` | `string` | Yes | Unique identifier for the guide |
| `onDateSelect` | `(date: Date, availability: AvailabilitySlot \| null) => void` | Yes | Callback fired when a date is selected |
| `defaultPrice` | `number` | No | Default price shown when no override exists (default: 0) |
| `className` | `string` | No | Additional CSS classes |
| `fetchAvailability` | `Function` | No | Custom data fetcher (see Custom Backend section) |

## Data Types

### AvailabilitySlot

```typescript
interface AvailabilitySlot {
  id: string;
  date: Date;
  start_time: string;        // Format: "HH:mm" (e.g., "08:00")
  end_time: string;          // Format: "HH:mm" (e.g., "17:00")
  available_spots: number;   // Spots still available
  total_spots: number;       // Total capacity
  price_override?: number;   // Optional special pricing
  is_available: boolean;     // Overall availability flag
  booking_count?: number;    // Number of confirmed bookings
}
```

### CalendarEvent

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: AvailabilitySlot;
  availabilityStatus: 'available' | 'limited' | 'booked' | 'unavailable';
}
```

## Supabase Setup

### Database Schema

Create the following table in Supabase:

```sql
-- Service availability table
CREATE TABLE service_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id TEXT NOT NULL,
  guide_id TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available_spots INTEGER NOT NULL,
  total_spots INTEGER NOT NULL,
  price_override DECIMAL(10, 2),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(service_id, guide_id, date)
);

-- Service bookings table (for tracking booked spots)
CREATE TABLE service_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  availability_id UUID REFERENCES service_availability(id),
  customer_id TEXT NOT NULL,
  booking_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_availability_service_guide ON service_availability(service_id, guide_id);
CREATE INDEX idx_availability_date ON service_availability(date);
CREATE INDEX idx_bookings_availability ON service_bookings(availability_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to availability
CREATE POLICY "Public can view availability"
  ON service_availability FOR SELECT
  USING (true);

-- Only authenticated users can book
CREATE POLICY "Authenticated users can create bookings"
  ON service_bookings FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

## Custom Backend Integration

If you're not using Supabase, provide a custom `fetchAvailability` function:

```tsx
import { BookingCalendar } from '@/components/booking';

const customFetcher = async ({ serviceId, guideId, startDate, endDate }) => {
  const response = await fetch(
    `/api/availability?service=${serviceId}&guide=${guideId}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
  );
  
  const data = await response.json();
  
  // Transform to expected format
  return data.map(slot => ({
    id: slot.id,
    date: new Date(slot.date),
    start_time: slot.startTime,
    end_time: slot.endTime,
    available_spots: slot.availableSpots,
    total_spots: slot.totalSpots,
    price_override: slot.specialPrice,
    is_available: slot.isAvailable,
    booking_count: slot.bookings || 0,
  }));
};

function MyComponent() {
  return (
    <BookingCalendar
      serviceId="123"
      guideId="456"
      onDateSelect={(date, availability) => {}}
      fetchAvailability={customFetcher}
    />
  );
}
```

## Complete Example with Booking Flow

See `BookingCalendarExample.tsx` for a complete implementation with:
- Date selection
- Booking summary sidebar
- Price display
- Checkout flow integration

```tsx
import { BookingCalendarExample } from '@/components/booking/BookingCalendarExample';

// Use the complete example
<BookingCalendarExample />
```

## Styling & Customization

The component uses CSS custom properties for theming:

```css
.booking-calendar-container {
  --rbc-border-color: hsl(var(--border));
  --rbc-text-color: hsl(var(--foreground));
}
```

### Color Coding

- 🟢 **Green** - Fully available (lots of spots)
- 🟡 **Amber** - Limited availability (30% or less remaining)
- 🔵 **Blue** - Partially booked (some bookings exist)
- 🔴 **Red** - Unavailable or fully booked

### Mobile Optimization

The component automatically adjusts for mobile devices:
- Smaller font sizes
- Compact event display
- Touch-friendly interactions
- Responsive calendar height

## Mock Data Mode

For testing without a backend, the component automatically generates mock data showing:
- Weekday availability (Mon-Sat)
- Sundays/Mondays marked as unavailable
- Random booking counts
- Saturday premium pricing

No configuration needed - it works out of the box!

## Error Handling

The component handles various error scenarios:

1. **Network Errors** - Shows error alert with retry button
2. **No Data** - Displays helpful message to contact guide
3. **Past Dates** - Automatically disabled and visually dimmed
4. **Full Bookings** - Clear visual indication with "Unavailable" badge

## Performance

- **React Query Caching** - 5-minute stale time reduces API calls
- **Optimized Rendering** - Memoized event and prop getters
- **Lazy Loading** - Only fetches current month's data
- **Parallel Safe** - Uses proper dependency arrays

## Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Accessibility

- Keyboard navigation support via react-big-calendar
- Semantic HTML structure
- ARIA labels on interactive elements
- Focus management
- Screen reader friendly

## Troubleshooting

### Calendar not showing data

1. Check browser console for errors
2. Verify `serviceId` and `guideId` are correct
3. Check Supabase connection (if using)
4. Ensure date range includes available slots

### Styling issues

1. Verify `react-big-calendar/lib/css/react-big-calendar.css` is imported
2. Check that shadcn/ui components are installed
3. Ensure Tailwind CSS is configured properly

### TypeScript errors

1. Install types: `npm install --save-dev @types/react-big-calendar`
2. Check that date-fns is installed
3. Verify all imports are correct

## License

Part of the Alaska Guide Search project.

## Support

For issues or questions, please contact the development team or open an issue in the project repository.
