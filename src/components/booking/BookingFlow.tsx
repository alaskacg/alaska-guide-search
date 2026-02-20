import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  Calendar, 
  Users, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Initialize Stripe
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Types
interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  maxGuests: number;
}

interface BookingFlowProps {
  guideId: string;
  serviceId?: string;
  onComplete: (bookingId: string) => void;
}

// Validation Schemas
const step1Schema = z.object({
  serviceId: z.string().min(1, 'Please select a service'),
});

const step2Schema = z.object({
  date: z.date({
    required_error: 'Please select a date',
  }),
  guests: z.number().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

const step3Schema = z.object({
  specialRequests: z.string().optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;

// Mock data - replace with actual API calls
const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Guided Fishing Trip',
    description: 'Full day guided fishing experience on pristine Alaskan waters',
    basePrice: 400,
    duration: 8,
    maxGuests: 6,
  },
  {
    id: 'service-2',
    name: 'Wildlife Photography Tour',
    description: 'Capture Alaska\'s magnificent wildlife with expert guidance',
    basePrice: 350,
    duration: 6,
    maxGuests: 4,
  },
  {
    id: 'service-3',
    name: 'Glacier Hiking Adventure',
    description: 'Explore ancient glaciers with professional equipment provided',
    basePrice: 500,
    duration: 10,
    maxGuests: 8,
  },
];

// Stepper Component
const Stepper = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const steps = [
    { number: 1, label: 'Service', icon: FileText },
    { number: 2, label: 'Details', icon: Calendar },
    { number: 3, label: 'Review', icon: Users },
    { number: 4, label: 'Payment', icon: CreditCard },
    { number: 5, label: 'Confirm', icon: CheckCircle2 },
  ];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isActive && 'border-primary text-primary',
                    !isActive && !isCompleted && 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium hidden sm:block',
                    isActive && 'text-primary',
                    !isActive && 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2',
                    currentStep > step.number ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
      <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
    </div>
  );
};

// Step 1: Select Service
const Step1SelectService = ({
  selectedServiceId,
  onNext,
  preSelectedServiceId,
}: {
  selectedServiceId?: string;
  onNext: (data: Step1Data) => void;
  preSelectedServiceId?: string;
}) => {
  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      serviceId: preSelectedServiceId || selectedServiceId || '',
    },
  });

  const [selectedService, setSelectedService] = useState<Service | undefined>(
    mockServices.find(s => s.id === (preSelectedServiceId || selectedServiceId))
  );

  useEffect(() => {
    if (preSelectedServiceId) {
      onNext({ serviceId: preSelectedServiceId });
    }
  }, [preSelectedServiceId, onNext]);

  const handleServiceSelect = (serviceId: string) => {
    const service = mockServices.find(s => s.id === serviceId);
    setSelectedService(service);
    form.setValue('serviceId', serviceId);
  };

  const onSubmit = (data: Step1Data) => {
    onNext(data);
  };

  if (preSelectedServiceId) return null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select a Service</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockServices.map((service) => (
            <Card
              key={service.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectedService?.id === service.id && 'ring-2 ring-primary'
              )}
              onClick={() => handleServiceSelect(service.id)}
            >
              <CardHeader>
                <CardTitle className="text-base">{service.name}</CardTitle>
                <CardDescription className="text-sm">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold">${service.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{service.duration} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max Guests:</span>
                    <span>{service.maxGuests} people</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {form.formState.errors.serviceId && (
          <p className="text-sm text-destructive mt-2">{form.formState.errors.serviceId.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!selectedService}>
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

// Step 2: Date & Guest Details
const Step2DateGuests = ({
  data,
  selectedService,
  onNext,
  onBack,
}: {
  data?: Step2Data;
  selectedService: Service;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
}) => {
  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: data || {
      guests: 2,
      name: '',
      email: '',
      phone: '',
    },
  });

  const [date, setDate] = useState<Date | undefined>(data?.date);

  const onSubmit = (formData: Step2Data) => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    onNext({ ...formData, date });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose Date & Number of Guests</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Select Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    form.setValue('date', newDate!);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.date && (
              <p className="text-sm text-destructive">{form.formState.errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <Select
              value={form.watch('guests')?.toString()}
              onValueChange={(value) => form.setValue('guests', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: selectedService.maxGuests }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.guests && (
              <p className="text-sm text-destructive">{form.formState.errors.guests.message}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...form.register('name')}
              placeholder="John Doe"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              placeholder="john@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...form.register('phone')}
              placeholder="(555) 123-4567"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit">
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

// Step 3: Review & Special Requests
const Step3Review = ({
  data,
  selectedService,
  dateGuestData,
  onNext,
  onBack,
}: {
  data?: Step3Data;
  selectedService: Service;
  dateGuestData: Step2Data;
  onNext: (data: Step3Data) => void;
  onBack: () => void;
}) => {
  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: data || {
      specialRequests: '',
    },
  });

  const calculatePricing = () => {
    const basePrice = selectedService.basePrice;
    const guestPrice = basePrice * dateGuestData.guests;
    const serviceFee = guestPrice * 0.05;
    const depositAmount = (guestPrice + serviceFee) * 0.25;
    const totalAmount = guestPrice + serviceFee;
    const remainingBalance = totalAmount - depositAmount;

    return {
      basePrice,
      guestPrice,
      serviceFee,
      depositAmount,
      totalAmount,
      remainingBalance,
    };
  };

  const pricing = calculatePricing();

  const onSubmit = (formData: Step3Data) => {
    onNext(formData);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Your Booking</h3>
        
        <Card>
          <CardHeader>
            <CardTitle>{selectedService.name}</CardTitle>
            <CardDescription>{selectedService.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{format(dateGuestData.date, 'PPPP')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests:</span>
                <span className="font-medium">{dateGuestData.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{selectedService.duration} hours</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Contact Details</h4>
              <div className="text-sm space-y-1">
                <p>{dateGuestData.name}</p>
                <p className="text-muted-foreground">{dateGuestData.email}</p>
                <p className="text-muted-foreground">{dateGuestData.phone}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold">Pricing Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    ${selectedService.basePrice} × {dateGuestData.guests} guests
                  </span>
                  <span>${pricing.guestPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee (5%)</span>
                  <span>${pricing.serviceFee.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>${pricing.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-primary">
                  <span>Deposit Due Today (25%)</span>
                  <span className="font-semibold">${pricing.depositAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Remaining Balance</span>
                  <span>${pricing.remainingBalance.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
        <Textarea
          id="specialRequests"
          {...form.register('specialRequests')}
          placeholder="Let us know if you have any dietary restrictions, accessibility needs, or special requests..."
          className="min-h-[100px]"
        />
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          The remaining balance of ${pricing.remainingBalance.toFixed(2)} will be due on the day of your adventure.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit">
          Proceed to Payment <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

// Step 4: Payment Form
const Step4Payment = ({
  guideId,
  selectedService,
  dateGuestData,
  onSuccess,
  onBack,
}: {
  guideId: string;
  selectedService: Service;
  dateGuestData: Step2Data;
  onSuccess: () => void;
  onBack: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const calculateDepositAmount = () => {
    const basePrice = selectedService.basePrice;
    const guestPrice = basePrice * dateGuestData.guests;
    const serviceFee = guestPrice * 0.05;
    const totalAmount = guestPrice + serviceFee;
    return totalAmount * 0.25;
  };

  const depositAmount = calculateDepositAmount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setIsProcessing(true);

    try {
      if (!agreedToTerms) {
        throw new Error('Please accept the booking and escrow terms before payment.');
      }

      const paymentPayload = {
        amount: Math.round(depositAmount * 100), // cents
        guideId,
        serviceId: selectedService.id,
        metadata: {
          customerName: dateGuestData.name,
          customerEmail: dateGuestData.email,
          bookingDate: dateGuestData.date.toISOString(),
          guests: dateGuestData.guests,
        },
      };

      const endpoints = ['/api/bookings/create-deposit-payment', '/api/create-payment-intent'];
      let clientSecret: string | undefined;

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentPayload),
        });

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        clientSecret = data.client_secret || data.clientSecret;
        if (clientSecret) break;
      }

      if (!clientSecret) {
        throw new Error('Unable to initialize payment. Please contact support before retrying.');
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: dateGuestData.name,
            email: dateGuestData.email,
            phone: dateGuestData.phone,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        toast.error(stripeError.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during payment';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        
        <Card>
          <CardHeader>
            <CardTitle>Deposit Payment</CardTitle>
            <CardDescription>
              Secure your booking with a 25% deposit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Deposit Amount:</span>
                <span className="text-2xl font-bold text-primary">
                  ${depositAmount.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Card Information</Label>
              <div className="border rounded-md p-3 bg-background">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: 'hsl(var(--foreground))',
                        '::placeholder': {
                          color: 'hsl(var(--muted-foreground))',
                        },
                      },
                      invalid: {
                        color: 'hsl(var(--destructive))',
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>🔒 Your payment information is encrypted and secure</p>
              <p>💳 Powered by Stripe</p>
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                I agree to the booking terms, cancellation policy, and escrow handling for this deposit.
              </span>
            </label>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          By proceeding, you agree to pay the deposit amount. The remaining balance will be collected on the day of your adventure.
        </AlertDescription>
      </Alert>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isProcessing}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button type="submit" disabled={!stripe || isProcessing || !agreedToTerms}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay ${depositAmount.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// Step 5: Confirmation
const Step5Confirmation = ({
  selectedService,
  dateGuestData,
  bookingId,
}: {
  selectedService: Service;
  dateGuestData: Step2Data;
  bookingId: string;
}) => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">
          Your adventure is all set. We've sent a confirmation email to {dateGuestData.email}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            <Badge>Confirmed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <div className="grid gap-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID:</span>
              <span className="font-mono font-medium">{bookingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{format(dateGuestData.date, 'PPPP')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guests:</span>
              <span className="font-medium">{dateGuestData.guests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact:</span>
              <span className="font-medium">{dateGuestData.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>What's Next?</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• You'll receive a confirmation email with all the details</li>
            <li>• The guide will contact you 24-48 hours before your adventure</li>
            <li>• The remaining balance will be due on the day of your trip</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => window.print()}>
          Print Confirmation
        </Button>
        <Button onClick={() => window.location.href = '/'}>
          Book Another Adventure
        </Button>
      </div>
    </div>
  );
};

// Main BookingFlow Component
export default function BookingFlow({ guideId, serviceId, onComplete }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<{
    step1?: Step1Data;
    step2?: Step2Data;
    step3?: Step3Data;
  }>({});
  const [bookingId, setBookingId] = useState<string>('');

  const selectedService = mockServices.find(
    s => s.id === (bookingData.step1?.serviceId || serviceId)
  );

  const handleStep1Next = (data: Step1Data) => {
    setBookingData(prev => ({ ...prev, step1: data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: Step2Data) => {
    setBookingData(prev => ({ ...prev, step2: data }));
    setCurrentStep(3);
  };

  const handleStep3Next = (data: Step3Data) => {
    setBookingData(prev => ({ ...prev, step3: data }));
    setCurrentStep(4);
  };

  const handlePaymentSuccess = () => {
    // Generate booking ID (in production, this would come from the server)
    const generatedBookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setBookingId(generatedBookingId);
    setCurrentStep(5);
    onComplete(generatedBookingId);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Book Your Adventure</CardTitle>
          <CardDescription>
            Complete your booking in just a few simple steps
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Stepper currentStep={currentStep} totalSteps={5} />

          <div className="mt-8">
            {currentStep === 1 && (
              <Step1SelectService
                selectedServiceId={bookingData.step1?.serviceId}
                onNext={handleStep1Next}
                preSelectedServiceId={serviceId}
              />
            )}

            {currentStep === 2 && selectedService && (
              <Step2DateGuests
                data={bookingData.step2}
                selectedService={selectedService}
                onNext={handleStep2Next}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && selectedService && bookingData.step2 && (
              <Step3Review
                data={bookingData.step3}
                selectedService={selectedService}
                dateGuestData={bookingData.step2}
                onNext={handleStep3Next}
                onBack={handleBack}
              />
            )}

            {currentStep === 4 && selectedService && bookingData.step2 && (
              stripePromise ? (
                <Elements stripe={stripePromise}>
                  <Step4Payment
                    guideId={guideId}
                    selectedService={selectedService}
                    dateGuestData={bookingData.step2}
                    onSuccess={handlePaymentSuccess}
                    onBack={handleBack}
                  />
                </Elements>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Payments are temporarily unavailable because Stripe is not configured.
                  </AlertDescription>
                </Alert>
              )
            )}

            {currentStep === 5 && selectedService && bookingData.step2 && (
              <Step5Confirmation
                selectedService={selectedService}
                dateGuestData={bookingData.step2}
                bookingId={bookingId}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
