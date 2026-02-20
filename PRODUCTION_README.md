# Alaska Guide Search - Production Booking Platform

## 🎯 Overview

A world-class booking platform for Alaska outdoor guides featuring AI-verified 25% deposits, comprehensive guide management, real-time availability, Stripe Connect payments, and advanced analytics.

## ✨ Key Features

### For Customers
- **Browse & Search** - Find guides by activity, location, rating, and availability
- **Smart Booking** - Multi-step wizard with calendar selection
- **Low Deposits** - Only 25% upfront (vs. industry 50%) thanks to AI verification
- **Secure Payments** - Stripe-powered with 256-bit SSL encryption
- **Check-in System** - QR code or manual code verification
- **Reviews & Ratings** - Leave detailed feedback with photos
- **Real-time Messaging** - Chat with guides about bookings
- **Mobile Optimized** - Fully responsive on all devices

### For Guides
- **Professional Profiles** - Custom booking pages at `/book/[username]`
- **Service Management** - Create and manage offerings with photos/videos
- **Availability Calendar** - Manage booking slots by date
- **Comprehensive Dashboard** - Earnings, bookings, analytics
- **Media Gallery** - Upload photos/videos with drag-and-drop
- **Review Management** - Respond to customer reviews
- **Stripe Connect** - Direct payouts to bank account
- **Analytics** - Revenue trends, conversion rates, customer insights

### For Admins
- **All Bookings** - Platform-wide booking management
- **Guide Approval** - Verify credentials and approve new guides
- **Revenue Analytics** - Track platform fees and trends
- **Dispute Management** - Handle conflicts with resolution tools
- **Platform Settings** - Configure fees, policies, features

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Real-time + Storage + Auth)
- **Payments**: Stripe Connect
- **Charts**: Recharts
- **Calendar**: React Big Calendar
- **Media**: React Dropzone + browser-image-compression
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Database Schema
Comprehensive PostgreSQL schema with 15+ tables:
- `profiles` - User accounts
- `guides` - Guide business profiles
- `guide_services` - Service offerings
- `availability` - Calendar slots
- `bookings` - Booking records
- `booking_payments` - Payment tracking
- `reviews` - Customer reviews
- `media_uploads` - Photos/videos
- `messages` - Customer-guide chat
- `notifications` - System notifications
- `disputes` - Conflict resolution
- `platform_analytics` - Business metrics
- `platform_config` - System settings

See `/supabase/migrations/` for complete schema.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier works)
- Stripe account for payments

### 1. Clone and Install

```bash
cd /home/j/alaska-guide-search-5eb467da
npm install
```

### 2. Environment Setup

Create `.env` file:

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_STRIPE_CONNECT_CLIENT_ID=your_stripe_connect_client_id

# Optional
VITE_APP_URL=http://localhost:5173
```

Keep Stripe secret keys on your backend/webhook service only.

### 3. Database Setup

#### Option A: Supabase Dashboard
1. Go to Supabase Dashboard > SQL Editor
2. Run migration file: `/supabase/migrations/20260215000001_comprehensive_booking_platform.sql`
3. Enable Realtime on `notifications` table

#### Option B: Supabase CLI
```bash
supabase db push
```

### 4. Stripe Setup

1. **Create Stripe Connect Account**
   - Enable Stripe Connect in Dashboard
   - Choose "Express" account type
   - Get Client ID from settings

2. **Configure Webhooks** (for production)
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events: `payment_intent.*`, `account.*`, `transfer.*`

3. **Test Cards**
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

### 5. Storage Buckets

Create in Supabase Dashboard > Storage:

```
guide-media (public)
guide-documents (private)
booking-media (public)
review-media (public)
```

Set permissions:
- Public buckets: Allow read for all, write for authenticated users
- Private buckets: Allow read/write only for bucket owner

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

## 📁 Project Structure

```
alaska-guide-search-5eb467da/
├── src/
│   ├── components/
│   │   ├── booking/           # Booking flow components
│   │   │   ├── BookingCalendar.tsx
│   │   │   ├── BookingFlow.tsx
│   │   │   ├── CheckInSystem.tsx
│   │   │   ├── DepositPayment.tsx
│   │   │   └── RemainderPayment.tsx
│   │   ├── media/             # Media management
│   │   │   ├── MediaUploader.tsx
│   │   │   ├── MediaGallery.tsx
│   │   │   └── VideoPlayer.tsx
│   │   ├── notifications/     # Notification system
│   │   │   ├── NotificationBell.tsx
│   │   │   └── NotificationCenter.tsx
│   │   ├── trust/             # Verification & trust
│   │   │   ├── AIVerificationExplainer.tsx
│   │   │   ├── VerificationBadge.tsx
│   │   │   └── GuideVerificationCard.tsx
│   │   └── ui/                # shadcn/ui components
│   ├── pages/
│   │   ├── guide-dashboard/   # Guide dashboard pages
│   │   │   ├── Overview.tsx
│   │   │   ├── Bookings.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── ...
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AllBookings.tsx
│   │   │   ├── GuideApproval.tsx
│   │   │   └── ...
│   │   ├── GuideBookingPage.tsx  # Custom guide pages
│   │   └── ...
│   ├── hooks/
│   │   ├── useBooking.ts      # Booking operations
│   │   ├── useNotifications.ts
│   │   └── ...
│   ├── types/
│   │   └── booking.ts         # TypeScript types
│   ├── utils/
│   │   └── booking.ts         # Helper functions
│   └── ...
├── supabase/
│   └── migrations/
│       └── 20260215000001_comprehensive_booking_platform.sql
├── package.json
└── README.md
```

## 💳 Payment Flow

### Booking Flow (25% Deposit)
1. Customer selects service and date
2. System calculates:
   - Total price: $1,000
   - Deposit (25%): $250
   - Remainder (75%): $750
   - Platform fee (5% of total): $50
   - Guide payout: $950
3. Customer pays $250 deposit via Stripe
4. Booking status: `deposit_paid`
5. Guide receives confirmation

### Check-in Flow (75% Remainder)
1. Customer arrives for trip
2. Guide scans QR code or enters check-in code
3. System charges remaining $750
4. Booking status: `checked_in`
5. Trip begins

### Payout Flow
1. Customer completes trip
2. Booking status: `completed`
3. After 24-hour dispute window:
   - Platform fee ($50) held by platform
   - Guide receives $950 payout
4. Funds transfer to guide's bank account

## 🔒 Security Features

- **SSL Encryption** - All data encrypted in transit
- **PCI Compliance** - Stripe handles all card data
- **Row Level Security** - Database-level access control
- **Authentication** - Supabase Auth with JWT tokens
- **CORS Protection** - API endpoint restrictions
- **Input Validation** - Zod schemas on all forms
- **XSS Prevention** - React's built-in protections
- **CSRF Tokens** - On sensitive operations

## 🧪 Testing

### Manual Testing Checklist

#### Customer Flow
- [ ] Browse guides and services
- [ ] Select date and view availability
- [ ] Complete booking with test card
- [ ] Receive confirmation email
- [ ] View booking in dashboard
- [ ] Check in with QR code
- [ ] Leave review after trip

#### Guide Flow
- [ ] Register as guide
- [ ] Connect Stripe account
- [ ] Create service offering
- [ ] Set availability
- [ ] Upload photos/videos
- [ ] Receive and accept booking
- [ ] Check in customer
- [ ] Respond to review

#### Admin Flow
- [ ] View all bookings
- [ ] Approve guide application
- [ ] Review revenue analytics
- [ ] Handle dispute
- [ ] Update platform settings

## 📊 Metrics & Analytics

### Platform Metrics
- Total bookings
- Revenue (total, by period)
- Platform fees collected
- Active guides
- Completion rate
- Average booking value

### Guide Metrics
- Revenue trends
- Booking conversion rate
- Service performance
- Customer demographics
- Response time
- Acceptance rate

## 🎨 Design System

### Colors
- **Primary** - Alaska Blue (#0EA5E9)
- **Secondary** - Forest Green (#10B981)
- **Accent** - Gold (#F59E0B)
- **Background** - Slate (#0F172A, #1E293B)
- **Text** - White/Slate

### Typography
- **Headings** - Inter (bold, semi-bold)
- **Body** - Inter (regular)
- **Mono** - JetBrains Mono

### Components
All components use shadcn/ui with Tailwind CSS. See `/src/components/ui/` for primitives.

## 🔧 Configuration

### Platform Settings (Admin)
Configure in Admin Dashboard > Settings:

- **Platform Fee** - Default 5%
- **Deposit Percentage** - Default 25%
- **Cancellation Policies** - Define refund rules
- **Email Templates** - Customize notifications
- **Feature Flags** - Enable/disable features

### Environment Variables

See `.env.example` for all options.

## 📱 Mobile Optimization

- Responsive breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Touch-optimized inputs
- Mobile-first design
- Progressive Web App (PWA) ready
- Optimized images with lazy loading

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables
Set all `VITE_*` variables in your hosting platform's environment settings.

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection
- Check Supabase URL and anon key
- Verify RLS policies are enabled
- Check network firewall settings

### Stripe Issues
- Verify API keys (use test keys in development)
- Check webhook signatures
- Review Stripe Dashboard logs

## 📚 Documentation

Comprehensive docs in component directories:
- `/src/components/booking/README.md` - Booking system
- `/src/components/media/SETUP.md` - Media management
- `/src/components/notifications/README.md` - Notifications
- `/src/components/trust/README.md` - Verification system
- `/src/pages/admin/README.md` - Admin dashboard

## 🤝 Contributing

This is a production platform handling real transactions. All changes must:
- Include TypeScript types
- Have proper error handling
- Be mobile responsive
- Follow existing patterns
- Include documentation

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
1. Check documentation in component directories
2. Review Supabase logs
3. Check Stripe Dashboard
4. Contact development team

---

**Built with ❄️ for Alaska's finest outdoor guides**
