import { Booking, BookingStatus, CancellationPolicyType } from '@/types/booking';

/**
 * Payment breakdown details
 */
export interface PaymentBreakdown {
  totalPrice: number;
  depositAmount: number;
  remainderAmount: number;
  platformFee: number;
  guidePayout: number;
}

/**
 * Calculates payment breakdown with deposit (25%), remainder (75%), and platform fee (5%)
 * @param totalPrice - Total price of the booking
 * @returns PaymentBreakdown object with all calculated amounts
 * @throws Error if totalPrice is invalid
 */
export function calculatePaymentBreakdown(totalPrice: number): PaymentBreakdown {
  if (typeof totalPrice !== 'number' || isNaN(totalPrice) || totalPrice < 0) {
    throw new Error('Total price must be a valid non-negative number');
  }

  const depositPercentage = 0.25;
  const platformFeePercentage = 0.05;

  const depositAmount = Math.round(totalPrice * depositPercentage * 100) / 100;
  const remainderAmount = Math.round((totalPrice - depositAmount) * 100) / 100;
  const platformFee = Math.round(totalPrice * platformFeePercentage * 100) / 100;
  const guidePayout = Math.round((totalPrice - platformFee) * 100) / 100;

  return {
    totalPrice: Math.round(totalPrice * 100) / 100,
    depositAmount,
    remainderAmount,
    platformFee,
    guidePayout,
  };
}

/**
 * Gets cancellation deadline based on booking date and cancellation policy
 * @param bookingDate - The date of the booking
 * @param policy - The cancellation policy type
 * @returns Date representing the cancellation deadline
 * @throws Error if bookingDate is invalid
 */
export function getCancellationDeadline(
  bookingDate: Date,
  policy: CancellationPolicyType
): Date {
  if (!(bookingDate instanceof Date) || isNaN(bookingDate.getTime())) {
    throw new Error('Booking date must be a valid Date object');
  }

  const deadline = new Date(bookingDate);

  switch (policy) {
    case CancellationPolicyType.FLEXIBLE:
      // Cancel up to 24 hours before for full refund
      deadline.setHours(deadline.getHours() - 24);
      break;
    case CancellationPolicyType.MODERATE:
      // Cancel up to 5 days before for full refund
      deadline.setDate(deadline.getDate() - 5);
      break;
    case CancellationPolicyType.STRICT:
      // Cancel up to 14 days before for full refund
      deadline.setDate(deadline.getDate() - 14);
      break;
    case CancellationPolicyType.SUPER_STRICT:
      // Cancel up to 30 days before for 50% refund
      deadline.setDate(deadline.getDate() - 30);
      break;
    case CancellationPolicyType.NON_REFUNDABLE:
      // No refund deadline - set to booking date
      break;
    default:
      // Default to moderate policy
      deadline.setDate(deadline.getDate() - 5);
      break;
  }

  return deadline;
}

/**
 * Checks if a booking can be cancelled based on its status
 * @param booking - The booking object
 * @returns true if the booking can be cancelled, false otherwise
 * @throws Error if booking is invalid
 */
export function canCancelBooking(booking: Booking): boolean {
  if (!booking || typeof booking !== 'object') {
    throw new Error('Invalid booking object');
  }

  // Cannot cancel if already cancelled, completed, or refunded
  const nonCancellableStatuses = [
    BookingStatus.CANCELLED,
    BookingStatus.COMPLETED,
    BookingStatus.REFUNDED,
  ];

  if (nonCancellableStatuses.includes(booking.status)) {
    return false;
  }

  // Check if booking date has passed
  try {
    const bookingDate = new Date(booking.start_date);
    const now = new Date();
    
    if (bookingDate < now) {
      return false;
    }
  } catch (error) {
    // If date parsing fails, allow cancellation to be safe
    console.error('Error parsing booking date:', error);
  }

  return true;
}

/**
 * Calculates refund amount based on cancellation policy and timing
 * @param booking - The booking object
 * @param cancelledAt - The date when cancellation is requested
 * @returns Refund amount in dollars
 * @throws Error if booking or cancelledAt is invalid
 */
export function calculateRefundAmount(booking: Booking, cancelledAt: Date): number {
  if (!booking || typeof booking !== 'object') {
    throw new Error('Invalid booking object');
  }

  if (!(cancelledAt instanceof Date) || isNaN(cancelledAt.getTime())) {
    throw new Error('Cancelled date must be a valid Date object');
  }

  // If already refunded or cancelled, return 0
  if (booking.status === BookingStatus.REFUNDED || booking.status === BookingStatus.CANCELLED) {
    return booking.refund_amount || 0;
  }

  const amountPaid = booking.amount_paid || 0;
  
  if (amountPaid <= 0) {
    return 0;
  }

  try {
    const bookingDate = new Date(booking.start_date);
    const hoursUntilBooking = (bookingDate.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60);
    const daysUntilBooking = hoursUntilBooking / 24;

    // Get cancellation policy from booking or default to MODERATE
    // In a real scenario, you'd fetch this from the guide's profile
    // For now, we'll implement standard refund policies
    let refundPercentage = 0;

    // Assuming MODERATE policy if not specified
    // You may need to fetch the actual policy from the guide's profile
    if (daysUntilBooking >= 14) {
      refundPercentage = 1.0; // 100% refund
    } else if (daysUntilBooking >= 7) {
      refundPercentage = 0.5; // 50% refund
    } else if (daysUntilBooking >= 2) {
      refundPercentage = 0.25; // 25% refund
    } else {
      refundPercentage = 0; // No refund
    }

    const refundAmount = Math.round(amountPaid * refundPercentage * 100) / 100;
    return Math.max(0, refundAmount);
  } catch (error) {
    console.error('Error calculating refund amount:', error);
    throw new Error('Failed to calculate refund amount');
  }
}

/**
 * Formats booking status to human-readable string
 * @param status - The booking status
 * @returns Human-readable status string
 */
export function formatBookingStatus(status: BookingStatus): string {
  const statusMap: Record<BookingStatus, string> = {
    [BookingStatus.PENDING]: 'Pending Confirmation',
    [BookingStatus.CONFIRMED]: 'Confirmed',
    [BookingStatus.IN_PROGRESS]: 'In Progress',
    [BookingStatus.COMPLETED]: 'Completed',
    [BookingStatus.CANCELLED]: 'Cancelled',
    [BookingStatus.DISPUTED]: 'Disputed',
    [BookingStatus.REFUNDED]: 'Refunded',
  };

  return statusMap[status] || 'Unknown Status';
}

/**
 * Gets Tailwind color class for booking status
 * @param status - The booking status
 * @returns Tailwind color class string
 */
export function getStatusColor(status: BookingStatus): string {
  const colorMap: Record<BookingStatus, string> = {
    [BookingStatus.PENDING]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [BookingStatus.CONFIRMED]: 'text-blue-600 bg-blue-50 border-blue-200',
    [BookingStatus.IN_PROGRESS]: 'text-purple-600 bg-purple-50 border-purple-200',
    [BookingStatus.COMPLETED]: 'text-green-600 bg-green-50 border-green-200',
    [BookingStatus.CANCELLED]: 'text-gray-600 bg-gray-50 border-gray-200',
    [BookingStatus.DISPUTED]: 'text-red-600 bg-red-50 border-red-200',
    [BookingStatus.REFUNDED]: 'text-orange-600 bg-orange-50 border-orange-200',
  };

  return colorMap[status] || 'text-gray-600 bg-gray-50 border-gray-200';
}

/**
 * Formats amount as USD currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 * @throws Error if amount is invalid
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Amount must be a valid number');
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generates QR code data (JSON string) for check-in
 * @param booking - The booking object
 * @returns JSON string for QR code generation
 * @throws Error if booking is invalid or missing required fields
 */
export function generateCheckInQRData(booking: Booking): string {
  if (!booking || typeof booking !== 'object') {
    throw new Error('Invalid booking object');
  }

  if (!booking.id || !booking.booking_number) {
    throw new Error('Booking must have id and booking_number');
  }

  try {
    const qrData = {
      bookingId: booking.id,
      bookingNumber: booking.booking_number,
      clientName: booking.client_details?.name || 'Unknown',
      guideId: booking.guide_id,
      serviceId: booking.service_id,
      startDate: booking.start_date,
      startTime: booking.start_time,
      participants: booking.participants,
      status: booking.status,
      verificationCode: generateVerificationCode(booking.id, booking.booking_number),
      generatedAt: new Date().toISOString(),
    };

    return JSON.stringify(qrData);
  } catch (error) {
    console.error('Error generating QR data:', error);
    throw new Error('Failed to generate check-in QR code data');
  }
}

/**
 * Generates a verification code for QR code validation
 * @param bookingId - The booking ID
 * @param bookingNumber - The booking number
 * @returns Verification code string
 */
function generateVerificationCode(bookingId: string, bookingNumber: string): string {
  // Simple hash-based verification code
  // In production, use a more secure method like HMAC
  const combined = `${bookingId}-${bookingNumber}`;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to alphanumeric string
  const code = Math.abs(hash).toString(36).toUpperCase().slice(0, 8);
  return code.padStart(8, '0');
}
