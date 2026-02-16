import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Booking } from '@/types/booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Shield, Lock, CheckCircle2, CreditCard, Calendar } from 'lucide-react';

interface RemainderPaymentProps {
  booking: Booking;
  onSuccess: (paymentIntentId: string) => void;
  autoTrigger?: boolean;
}

interface SavedPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

export function RemainderPayment({ booking, onSuccess, autoTrigger = false }: RemainderPaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'saved' | 'new'>('saved');
  const [savedCards, setSavedCards] = useState<SavedPaymentMethod[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [loadingCards, setLoadingCards] = useState(true);

  const remainingAmount = booking.amount_due;
  const depositPaid = booking.amount_paid;

  useEffect(() => {
    fetchSavedPaymentMethods();
  }, [booking.client_id]);

  useEffect(() => {
    // Auto-trigger payment on check-in if enabled
    if (autoTrigger && booking.status === 'in_progress') {
      // Show a notification that payment is being processed
      console.log('Auto-triggering remainder payment at check-in');
    }
  }, [autoTrigger, booking.status]);

  const fetchSavedPaymentMethods = async () => {
    try {
      setLoadingCards(true);
      const response = await fetch(`/api/payment-methods?client_id=${booking.client_id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch saved payment methods');
      }

      const data = await response.json();
      setSavedCards(data.payment_methods || []);
      
      if (data.payment_methods?.length > 0) {
        setSelectedCard(data.payment_methods[0].id);
        setPaymentMethod('saved');
      } else {
        setPaymentMethod('new');
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      setPaymentMethod('new');
    } finally {
      setLoadingCards(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please refresh and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent for remainder
      const response = await fetch('/api/bookings/create-remainder-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: booking.id,
          amount: remainingAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to initialize payment');
      }

      const { client_secret, payment_intent_id } = await response.json();

      let result;

      if (paymentMethod === 'saved' && selectedCard) {
        // Use saved payment method
        result = await stripe.confirmCardPayment(client_secret, {
          payment_method: selectedCard,
        });
      } else {
        // Use new card
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card information not found. Please try again.');
        }

        result = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: booking.client_details.name,
              email: booking.client_details.email,
              phone: booking.client_details.phone,
            },
          },
        });
      }

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed');
      }

      if (result.paymentIntent?.status === 'succeeded') {
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
          <Calendar className="h-5 w-5" />
          Final Payment (75%)
        </CardTitle>
        <CardDescription>
          Complete your booking payment at check-in
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Payment Summary */}
        <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Booking Price</span>
            <span>${booking.total_price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Deposit Paid</span>
            <span className="text-green-600">-${depositPaid.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Amount Due Now</span>
            <span className="text-primary">${remainingAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Booking Details */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Booking Number</span>
            <span className="font-mono">{booking.booking_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in Date</span>
            <span>{new Date(booking.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Check-in Time</span>
            <span>{booking.start_time}</span>
          </div>
        </div>

        <Separator />

        {/* Payment Method Selection */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {loadingCards ? (
            <div className="text-center py-4 text-muted-foreground">
              Loading payment methods...
            </div>
          ) : (
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as 'saved' | 'new')}
              className="space-y-3"
            >
              {savedCards.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="saved" id="saved" />
                    <Label htmlFor="saved" className="font-medium">
                      Use Saved Payment Method
                    </Label>
                  </div>
                  
                  {paymentMethod === 'saved' && (
                    <RadioGroup
                      value={selectedCard}
                      onValueChange={setSelectedCard}
                      className="ml-6 space-y-2"
                    >
                      {savedCards.map((card) => (
                        <div key={card.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={card.id} id={card.id} />
                          <Label htmlFor={card.id} className="flex items-center gap-2 cursor-pointer">
                            <CreditCard className="h-4 w-4" />
                            <span className="capitalize">{card.brand}</span>
                            <span>•••• {card.last4}</span>
                            <span className="text-muted-foreground text-xs">
                              Exp {card.exp_month}/{card.exp_year}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="font-medium">
                    Use New Payment Method
                  </Label>
                </div>

                {paymentMethod === 'new' && (
                  <div className="ml-6">
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
                )}
              </div>
            </RadioGroup>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={
              !stripe ||
              loading ||
              loadingCards ||
              (paymentMethod === 'new' && !cardComplete) ||
              (paymentMethod === 'saved' && !selectedCard)
            }
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Pay ${remainingAmount.toFixed(2)} Securely
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
          By completing this payment, you confirm receipt of services and agree to the final charges.
        </p>
        <p className="text-center">
          This payment completes your booking. A receipt will be sent to {booking.client_details.email}.
        </p>
      </CardFooter>
    </Card>
  );
}
