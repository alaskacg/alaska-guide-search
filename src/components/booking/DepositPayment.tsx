import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Booking } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, CheckCircle2, CreditCard } from 'lucide-react';

interface DepositPaymentProps {
  booking: Booking;
  onSuccess: (paymentIntentId: string) => void;
}

export function DepositPayment({ booking, onSuccess }: DepositPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const depositAmount = booking.deposit_amount || (booking.total_price * 0.25);
  const remainingAmount = booking.total_price - depositAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please refresh and try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card information not found. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent on your backend
      const response = await fetch('/api/bookings/create-deposit-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: booking.id,
          amount: depositAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initialize payment');
      }

      const { client_secret, payment_intent_id } = await response.json();

      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: booking.client_details.name,
              email: booking.client_details.email,
              phone: booking.client_details.phone,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(payment_intent_id);
      } else {
        throw new Error('Payment was not successful. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Deposit Payment (25%)
        </CardTitle>
        <CardDescription>
          Secure your booking with a {Math.round((depositAmount / booking.total_price) * 100)}% deposit
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Breakdown */}
        <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Booking Price</span>
            <span className="font-medium">${booking.total_price.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Deposit Due Now (25%)</span>
            <span className="text-primary">${depositAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Remaining at Check-in (75%)</span>
            <span>${remainingAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking Number</span>
            <span className="font-mono">{booking.booking_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{new Date(booking.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Participants</span>
            <span>{booking.participants}</span>
          </div>
        </div>

        <Separator />

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Card Information
            </label>
            <div className="border rounded-md p-3 bg-background">
              <CardElement
                options={cardElementOptions}
                onChange={(e) => setCardComplete(e.complete)}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!stripe || loading || !cardComplete}
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay ${depositAmount.toFixed(2)} Securely
              </>
            )}
          </Button>
        </form>

        {/* Security Badges */}
        <div className="space-y-3 pt-4">
          <Separator />
          <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-600" />
              <span>256-bit SSL Encryption</span>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4 text-green-600" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Powered by Stripe</span>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-xs text-muted-foreground">
        <p>
          By completing this payment, you agree to the cancellation policy and terms of service.
        </p>
        <p>
          The remaining balance of ${remainingAmount.toFixed(2)} will be charged at check-in.
        </p>
      </CardFooter>
    </Card>
  );
}
