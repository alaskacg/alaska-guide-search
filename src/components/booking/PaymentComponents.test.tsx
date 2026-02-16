/**
 * Payment Components Integration Test
 * 
 * Run this to verify both payment components work correctly
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DepositPayment } from './DepositPayment';
import { RemainderPayment } from './RemainderPayment';
import { Booking, BookingStatus, PaymentType } from '@/types/booking';

// Mock Stripe
vi.mock('@stripe/stripe-js');
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  useStripe: () => ({
    confirmCardPayment: vi.fn(),
  }),
  useElements: () => ({
    getElement: vi.fn(() => ({})),
  }),
}));

const mockBooking: Booking = {
  id: 'test-booking-123',
  booking_number: 'BK-2024-TEST',
  client_id: 'client-456',
  guide_id: 'guide-789',
  service_id: 'service-012',
  status: BookingStatus.PENDING,
  start_date: '2024-06-15',
  end_date: '2024-06-15',
  start_time: '08:00',
  end_time: '16:00',
  participants: 4,
  total_price: 1000.00,
  deposit_amount: 250.00,
  amount_paid: 0,
  amount_due: 1000.00,
  payment_type: PaymentType.DEPOSIT,
  client_details: {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+1-907-555-0100',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

describe('DepositPayment', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders deposit payment form', () => {
    render(
      <DepositPayment booking={mockBooking} onSuccess={mockOnSuccess} />
    );

    expect(screen.getByText(/Deposit Payment/i)).toBeInTheDocument();
    expect(screen.getByText(/25%/i)).toBeInTheDocument();
  });

  it('displays correct deposit amount', () => {
    render(
      <DepositPayment booking={mockBooking} onSuccess={mockOnSuccess} />
    );

    expect(screen.getByText('$250.00')).toBeInTheDocument();
  });

  it('displays booking details', () => {
    render(
      <DepositPayment booking={mockBooking} onSuccess={mockOnSuccess} />
    );

    expect(screen.getByText('BK-2024-TEST')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('shows security badges', () => {
    render(
      <DepositPayment booking={mockBooking} onSuccess={mockOnSuccess} />
    );

    expect(screen.getByText(/256-bit SSL Encryption/i)).toBeInTheDocument();
    expect(screen.getByText(/PCI DSS Compliant/i)).toBeInTheDocument();
    expect(screen.getByText(/Powered by Stripe/i)).toBeInTheDocument();
  });

  it('disables submit button when card incomplete', () => {
    render(
      <DepositPayment booking={mockBooking} onSuccess={mockOnSuccess} />
    );

    const submitButton = screen.getByRole('button', { name: /Pay/i });
    expect(submitButton).toBeDisabled();
  });
});

describe('RemainderPayment', () => {
  const mockOnSuccess = vi.fn();
  
  const bookingWithDeposit: Booking = {
    ...mockBooking,
    amount_paid: 250.00,
    amount_due: 750.00,
    status: BookingStatus.CONFIRMED,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ payment_methods: [] }),
      })
    ) as any;
  });

  it('renders remainder payment form', async () => {
    render(
      <RemainderPayment booking={bookingWithDeposit} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Final Payment/i)).toBeInTheDocument();
      expect(screen.getByText(/75%/i)).toBeInTheDocument();
    });
  });

  it('displays correct remainder amount', async () => {
    render(
      <RemainderPayment booking={bookingWithDeposit} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByText('$750.00')).toBeInTheDocument();
    });
  });

  it('shows deposit paid amount', async () => {
    render(
      <RemainderPayment booking={bookingWithDeposit} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByText('-$250.00')).toBeInTheDocument();
    });
  });

  it('fetches saved payment methods on mount', async () => {
    render(
      <RemainderPayment booking={bookingWithDeposit} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/payment-methods')
      );
    });
  });

  it('shows new payment method option when no saved cards', async () => {
    render(
      <RemainderPayment booking={bookingWithDeposit} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Use New Payment Method/i)).toBeInTheDocument();
    });
  });

  it('shows saved payment methods when available', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          payment_methods: [
            {
              id: 'pm_123',
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 2025,
            },
          ],
        }),
      })
    ) as any;

    render(
      <RemainderPayment booking={bookingWithDeposit} onSuccess={mockOnSuccess} />
    );

    await waitFor(() => {
      expect(screen.getByText(/Use Saved Payment Method/i)).toBeInTheDocument();
      expect(screen.getByText(/4242/i)).toBeInTheDocument();
    });
  });
});

describe('Payment Flow Integration', () => {
  it('calculates deposit and remainder correctly', () => {
    const total = 1000;
    const depositPercent = 0.25;
    const deposit = total * depositPercent;
    const remainder = total - deposit;

    expect(deposit).toBe(250);
    expect(remainder).toBe(750);
    expect(deposit + remainder).toBe(total);
  });

  it('handles different booking amounts', () => {
    const testCases = [
      { total: 500, deposit: 125, remainder: 375 },
      { total: 1200, deposit: 300, remainder: 900 },
      { total: 2000, deposit: 500, remainder: 1500 },
    ];

    testCases.forEach(({ total, deposit, remainder }) => {
      const calculated = total * 0.25;
      expect(calculated).toBe(deposit);
      expect(total - calculated).toBe(remainder);
    });
  });
});
