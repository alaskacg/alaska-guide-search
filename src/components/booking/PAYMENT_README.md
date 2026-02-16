# Payment Components Documentation

This directory contains Stripe-integrated payment components for handling booking deposits and final payments.

## Components

### 1. DepositPayment.tsx

Handles the initial 25% deposit payment for bookings.

**Features:**
- 25% deposit calculation from total booking price
- Stripe CardElement integration
- Payment breakdown display
- Real-time card validation
- Security badges (SSL, PCI DSS, Stripe)
- Production-ready error handling
- Loading states
- Responsive design with shadcn/ui

**Props:**
```typescript
interface DepositPaymentProps {
  booking: Booking;           // Full booking object
  onSuccess: (paymentIntentId: string) => void;  // Success callback
}
```

**Usage:**
```tsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DepositPayment } from '@/components/booking';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

function BookingCheckout({ booking }) {
  const handleSuccess = (paymentIntentId) => {
    console.log('Payment successful:', paymentIntentId);
    // Update booking status, send confirmation, etc.
  };

  return (
    <Elements stripe={stripePromise}>
      <DepositPayment booking={booking} onSuccess={handleSuccess} />
    </Elements>
  );
}
```

### 2. RemainderPayment.tsx

Handles the final 75% payment at check-in.

**Features:**
- Remainder payment calculation (75% of total)
- Saved payment method support
- New payment method option
- Auto-trigger capability on check-in
- Payment method selection UI
- Card information display (brand, last4, expiry)
- All security features from DepositPayment

**Props:**
```typescript
interface RemainderPaymentProps {
  booking: Booking;           // Full booking object
  onSuccess: (paymentIntentId: string) => void;  // Success callback
  autoTrigger?: boolean;      // Auto-trigger payment on check-in (optional)
}
```

**Usage with Saved Cards:**
```tsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { RemainderPayment } from '@/components/booking';

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckIn({ booking }) {
  const handleSuccess = (paymentIntentId) => {
    console.log('Final payment successful:', paymentIntentId);
    // Complete booking, trigger payout, request review
  };

  return (
    <Elements stripe={stripePromise}>
      <RemainderPayment 
        booking={booking} 
        onSuccess={handleSuccess}
        autoTrigger={false}  // Set to true for automatic payment at check-in
      />
    </Elements>
  );
}
```

## Required Backend Endpoints

Your backend must implement these API endpoints:

### 1. Create Deposit Payment Intent
```
POST /api/bookings/create-deposit-payment
Content-Type: application/json

{
  "booking_id": "string",
  "amount": number
}

Response:
{
  "client_secret": "string",
  "payment_intent_id": "string"
}
```

### 2. Create Remainder Payment Intent
```
POST /api/bookings/create-remainder-payment
Content-Type: application/json

{
  "booking_id": "string",
  "amount": number
}

Response:
{
  "client_secret": "string",
  "payment_intent_id": "string"
}
```

### 3. Get Saved Payment Methods
```
GET /api/payment-methods?client_id={id}

Response:
{
  "payment_methods": [
    {
      "id": "string",
      "brand": "visa",
      "last4": "4242",
      "exp_month": 12,
      "exp_year": 2025
    }
  ]
}
```

### 4. Confirm Deposit Payment
```
POST /api/bookings/{id}/confirm-deposit
Content-Type: application/json

{
  "payment_intent_id": "string"
}

Response: Updated booking object
```

### 5. Complete Final Payment
```
POST /api/bookings/{id}/complete-payment
Content-Type: application/json

{
  "payment_intent_id": "string"
}

Response: Updated booking object
```

## Backend Implementation Example (Node.js/Express)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create deposit payment
app.post('/api/bookings/create-deposit-payment', async (req, res) => {
  try {
    const { booking_id, amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        booking_id,
        payment_type: 'deposit',
      },
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create remainder payment
app.post('/api/bookings/create-remainder-payment', async (req, res) => {
  try {
    const { booking_id, amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        booking_id,
        payment_type: 'remainder',
      },
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get saved payment methods
app.get('/api/payment-methods', async (req, res) => {
  try {
    const { client_id } = req.query;
    
    // Get customer's Stripe ID from your database
    const customer = await getStripeCustomerIdForClient(client_id);
    
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.stripe_customer_id,
      type: 'card',
    });

    const formatted = paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      exp_month: pm.card.exp_month,
      exp_year: pm.card.exp_year,
    }));

    res.json({ payment_methods: formatted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

## Environment Variables

Add these to your `.env` file:

```env
# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend
STRIPE_SECRET_KEY=sk_test_...
```

## Payment Flow

### Deposit Payment Flow
1. Customer selects booking dates and confirms
2. `DepositPayment` component displays 25% deposit amount
3. Customer enters card details
4. On submit, component calls `/api/bookings/create-deposit-payment`
5. Backend creates Stripe PaymentIntent and returns client_secret
6. Component confirms payment with Stripe
7. On success, `onSuccess` callback is triggered
8. Update booking status to CONFIRMED

### Remainder Payment Flow
1. At check-in, `RemainderPayment` component is displayed
2. Component fetches saved payment methods
3. Customer chooses saved card or enters new card
4. On submit, component calls `/api/bookings/create-remainder-payment`
5. Backend creates Stripe PaymentIntent
6. Component confirms payment with saved or new payment method
7. On success, `onSuccess` callback is triggered
8. Update booking status to COMPLETED
9. Trigger payout to guide

## Security Features

Both components include:
- **256-bit SSL Encryption** - All data transmitted securely
- **PCI DSS Compliance** - Stripe handles sensitive card data
- **No Card Storage** - Card details never touch your servers
- **Secure Token System** - Uses Stripe's tokenization
- **Input Validation** - Real-time card validation
- **Error Handling** - Production-ready error messages

## Styling

Components use shadcn/ui for consistent, accessible design:
- `Card`, `CardHeader`, `CardContent`, `CardFooter`
- `Button` with loading states
- `Alert` for error messages
- `RadioGroup` for payment method selection
- `Separator` for visual hierarchy
- Lucide React icons

## TypeScript Support

Full TypeScript support with proper typing:
- `Booking` interface from `@/types/booking`
- Stripe types from `@stripe/stripe-js` and `@stripe/react-stripe-js`
- Props interfaces for type safety

## Testing

### Manual Testing Checklist

**DepositPayment:**
- [ ] Deposit amount calculates correctly (25% of total)
- [ ] Card validation works in real-time
- [ ] Submit disabled until card complete
- [ ] Loading state displays during processing
- [ ] Success callback triggered on successful payment
- [ ] Error messages display for failed payments
- [ ] Security badges visible
- [ ] Responsive on mobile devices

**RemainderPayment:**
- [ ] Remainder amount calculates correctly (75% of total)
- [ ] Saved cards load and display correctly
- [ ] Radio button selection works
- [ ] New card entry works when selected
- [ ] Submit disabled until payment method selected
- [ ] Success callback triggered on successful payment
- [ ] Auto-trigger works when enabled
- [ ] Error handling for missing saved cards

### Test Card Numbers

Use Stripe test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Auth Required:** 4000 0025 0000 3155

Use any future expiry date and any 3-digit CVC.

## Error Handling

Components handle these error scenarios:
- Stripe not initialized
- Network errors during API calls
- Invalid card information
- Payment declined
- Insufficient funds
- API endpoint errors
- Missing payment methods

## Accessibility

- Proper ARIA labels on form elements
- Keyboard navigation support
- Screen reader friendly
- High contrast text
- Touch-friendly buttons (min 44px)

## Performance

- Lazy loading Stripe.js
- Minimal re-renders
- Optimized card element styling
- Debounced validation

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Migration Guide

If migrating from a different payment system:

1. Install dependencies:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

2. Set up Stripe keys in `.env`

3. Implement backend endpoints (see above)

4. Wrap components in `<Elements>` provider

5. Update booking flow to use new components

## Troubleshooting

### "Stripe not initialized" error
- Check that `VITE_STRIPE_PUBLISHABLE_KEY` is set
- Ensure `Elements` wrapper is in place
- Verify Stripe promise is created before render

### Saved cards not loading
- Check `/api/payment-methods` endpoint
- Verify customer has Stripe customer ID
- Check for proper error handling

### Payment not confirming
- Verify backend returns correct `client_secret`
- Check network tab for API errors
- Ensure PaymentIntent amount matches

## Support

For issues or questions:
1. Check Stripe documentation: https://stripe.com/docs
2. Review error logs in browser console
3. Check network requests in DevTools
4. Verify backend API responses

## License

MIT
