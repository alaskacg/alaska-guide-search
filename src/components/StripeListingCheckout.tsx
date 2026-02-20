import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface CheckoutFormProps {
  onSuccess: () => void;
}

function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system is still initializing. Please wait and try again.');
      return;
    }

    if (!agreedToTerms) {
      setError('Please confirm the escrow and listing terms before submitting payment.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/listing-success`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-lg font-semibold text-gray-900">$10 flat fee. 60 days live.</p>
        <p className="text-sm text-gray-600 mt-1">One-time payment • Instant activation</p>
      </div>
      
      <PaymentElement />

      <label className="flex items-start gap-2 text-xs text-gray-600 cursor-pointer">
        <input
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I agree to the <Link to="/terms" className="text-blue-700 hover:underline">Terms of Service</Link> and{' '}
          <Link to="/escrow" className="text-blue-700 hover:underline">Escrow Agreement</Link>.
        </span>
      </label>
      
      {error && (
        <div className="bg-red-50 p-3 rounded-md border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading || !agreedToTerms}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Processing...' : 'Pay $10 & List Now'}
      </button>
    </form>
  );
}

interface StripeListingCheckoutProps {
  clientSecret: string;
  onSuccess: () => void;
}

export default function StripeListingCheckout({ clientSecret, onSuccess }: StripeListingCheckoutProps) {
  if (!stripePromise) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-red-200">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-red-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Payment Unavailable</h2>
            <p className="text-sm text-gray-700 mt-1">
              Stripe is not configured. Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> to enable checkout.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Complete Your Listing</h2>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onSuccess={onSuccess} />
      </Elements>
    </div>
  );
}
