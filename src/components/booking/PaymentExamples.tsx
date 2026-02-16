/**
 * Payment Components Usage Examples
 * 
 * This file demonstrates how to use the DepositPayment and RemainderPayment components
 */

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DepositPayment } from './DepositPayment';
import { RemainderPayment } from './RemainderPayment';
import { Booking, BookingStatus, PaymentType } from '@/types/booking';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Example booking data
const exampleBooking: Booking = {
  id: 'booking_123',
  booking_number: 'BK-2024-001',
  client_id: 'client_456',
  guide_id: 'guide_789',
  service_id: 'service_012',
  status: BookingStatus.CONFIRMED,
  start_date: '2024-06-15',
  end_date: '2024-06-15',
  start_time: '08:00',
  end_time: '16:00',
  participants: 4,
  total_price: 800.00,
  deposit_amount: 200.00,
  amount_paid: 0,
  amount_due: 800.00,
  payment_type: PaymentType.DEPOSIT,
  client_details: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-907-555-0100',
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/**
 * Example 1: Deposit Payment Flow
 * 
 * Use this when a customer is making their initial 25% deposit
 */
export function DepositPaymentExample() {
  const handleDepositSuccess = (paymentIntentId: string) => {
    console.log('Deposit payment successful!', paymentIntentId);
    
    // Update booking status
    // Navigate to confirmation page
    // Send confirmation email
    // Update database
  };

  return (
    <div className="container mx-auto py-8">
      <Elements stripe={stripePromise}>
        <DepositPayment
          booking={exampleBooking}
          onSuccess={handleDepositSuccess}
        />
      </Elements>
    </div>
  );
}

/**
 * Example 2: Remainder Payment Flow
 * 
 * Use this at check-in to collect the final 75% payment
 */
export function RemainderPaymentExample() {
  // Simulate a booking where deposit has been paid
  const bookingAfterDeposit: Booking = {
    ...exampleBooking,
    amount_paid: 200.00,
    amount_due: 600.00,
    status: BookingStatus.IN_PROGRESS,
  };

  const handleRemainderSuccess = (paymentIntentId: string) => {
    console.log('Remainder payment successful!', paymentIntentId);
    
    // Update booking to completed
    // Send receipt
    // Trigger payout to guide
    // Request review
  };

  return (
    <div className="container mx-auto py-8">
      <Elements stripe={stripePromise}>
        <RemainderPayment
          booking={bookingAfterDeposit}
          onSuccess={handleRemainderSuccess}
          autoTrigger={false} // Set to true to auto-trigger on check-in
        />
      </Elements>
    </div>
  );
}

/**
 * Example 3: Complete Booking Flow with Both Payment Stages
 */
export function CompletePaymentFlow() {
  const [currentStage, setCurrentStage] = useState<'deposit' | 'remainder'>('deposit');
  const [booking, setBooking] = useState<Booking>(exampleBooking);

  const handleDepositSuccess = async (paymentIntentId: string) => {
    console.log('Deposit successful:', paymentIntentId);
    
    // Update booking in your backend
    try {
      const response = await fetch(`/api/bookings/${booking.id}/confirm-deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_intent_id: paymentIntentId }),
      });
      
      if (response.ok) {
        const updatedBooking = await response.json();
        setBooking(updatedBooking);
        
        // Show success message
        alert('Deposit payment successful! Your booking is confirmed.');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const handleRemainderSuccess = async (paymentIntentId: string) => {
    console.log('Remainder payment successful:', paymentIntentId);
    
    try {
      const response = await fetch(`/api/bookings/${booking.id}/complete-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_intent_id: paymentIntentId }),
      });
      
      if (response.ok) {
        const updatedBooking = await response.json();
        setBooking(updatedBooking);
        
        // Show success message and redirect
        alert('Payment complete! Thank you for your booking.');
        window.location.href = '/booking/success';
      }
    } catch (error) {
      console.error('Error completing payment:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Elements stripe={stripePromise}>
        {currentStage === 'deposit' ? (
          <DepositPayment
            booking={booking}
            onSuccess={handleDepositSuccess}
          />
        ) : (
          <RemainderPayment
            booking={booking}
            onSuccess={handleRemainderSuccess}
          />
        )}
      </Elements>

      {/* Admin controls for demonstration */}
      <div className="mt-8 flex gap-4 justify-center">
        <button
          onClick={() => setCurrentStage('deposit')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Show Deposit Payment
        </button>
        <button
          onClick={() => setCurrentStage('remainder')}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Show Remainder Payment
        </button>
      </div>
    </div>
  );
}

/**
 * Example 4: Auto-trigger Remainder Payment on Check-in
 * 
 * This can be integrated into your check-in flow
 */
export function CheckInWithAutoPayment() {
  const [showPayment, setShowPayment] = useState(false);
  
  const bookingAtCheckIn: Booking = {
    ...exampleBooking,
    amount_paid: 200.00,
    amount_due: 600.00,
    status: BookingStatus.IN_PROGRESS,
  };

  const handleCheckIn = () => {
    // Perform check-in logic
    console.log('Checking in customer...');
    
    // Automatically show payment screen
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful at check-in:', paymentIntentId);
    setShowPayment(false);
    
    // Complete check-in process
    alert('Check-in complete! Enjoy your experience.');
  };

  return (
    <div className="container mx-auto py-8">
      {!showPayment ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Check In?</h2>
          <button
            onClick={handleCheckIn}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Check-In Process
          </button>
        </div>
      ) : (
        <Elements stripe={stripePromise}>
          <RemainderPayment
            booking={bookingAtCheckIn}
            onSuccess={handlePaymentSuccess}
            autoTrigger={true}
          />
        </Elements>
      )}
    </div>
  );
}

/**
 * Backend API Endpoints Required
 * 
 * These endpoints need to be implemented on your backend:
 * 
 * 1. POST /api/bookings/create-deposit-payment
 *    - Creates a Stripe PaymentIntent for the deposit amount
 *    - Returns: { client_secret, payment_intent_id }
 * 
 * 2. POST /api/bookings/create-remainder-payment
 *    - Creates a Stripe PaymentIntent for the remaining amount
 *    - Returns: { client_secret, payment_intent_id }
 * 
 * 3. GET /api/payment-methods?client_id={id}
 *    - Retrieves saved payment methods for a client
 *    - Returns: { payment_methods: Array<SavedPaymentMethod> }
 * 
 * 4. POST /api/bookings/{id}/confirm-deposit
 *    - Updates booking after successful deposit
 *    - Updates amount_paid, status to CONFIRMED
 * 
 * 5. POST /api/bookings/{id}/complete-payment
 *    - Updates booking after final payment
 *    - Updates amount_paid, status to COMPLETED
 *    - Triggers payout to guide
 */

import { useState } from 'react';
