/**
 * Booking Components
 * 
 * Export all booking-related components for easy importing
 */

export { BookingCalendar } from './BookingCalendar';
export { BookingCalendarExample, BookingCalendarWithCustomFetcher } from './BookingCalendarExample';
export { DepositPayment } from './DepositPayment';
export { RemainderPayment } from './RemainderPayment';

// Re-export types for convenience
export type {
  AvailabilitySlot,
  CalendarEvent,
  BookingCalendarProps,
} from './BookingCalendar';
