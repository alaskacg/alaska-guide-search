# 🚀 Alaska Guide Search - Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Supabase Configuration

#### A. Create Supabase Project
- [ ] Sign up at https://supabase.com
- [ ] Create new project
- [ ] Note your project URL and anon key

#### B. Run Database Migrations
```sql
-- In Supabase Dashboard > SQL Editor
-- Run: supabase/migrations/20260215000001_comprehensive_booking_platform.sql
```

- [ ] Migration executed successfully
- [ ] All 15 tables created
- [ ] RLS policies enabled
- [ ] Triggers and functions active

#### C. Enable Realtime
```sql
-- Enable Realtime on notifications table
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
```

- [ ] Realtime enabled for notifications
- [ ] Test subscription working

#### D. Create Storage Buckets

In Supabase Dashboard > Storage, create:

1. **guide-media** (public)
   - [ ] Bucket created
   - [ ] Public access enabled
   - [ ] Upload policy: Authenticated users can upload

2. **guide-documents** (private)
   - [ ] Bucket created
   - [ ] Private access
   - [ ] Policy: Owner can read/write

3. **booking-media** (public)
   - [ ] Bucket created
   - [ ] Public read access
   - [ ] Upload policy: Authenticated users

4. **review-media** (public)
   - [ ] Bucket created
   - [ ] Public read access

#### E. Set Up Edge Functions (Optional - for emails)
```bash
# Create function for email notifications
supabase functions new send-booking-email
```

- [ ] Email function deployed
- [ ] Resend API key configured
- [ ] Test email sent successfully

### 2. Stripe Configuration

#### A. Create Stripe Account
- [ ] Sign up at https://stripe.com
- [ ] Complete account verification
- [ ] Add bank account for payouts

#### B. Enable Stripe Connect
- [ ] Go to Dashboard > Connect
- [ ] Choose "Express" account type
- [ ] Complete Connect onboarding
- [ ] Note your Connect Client ID

#### C. Get API Keys
- [ ] Copy Publishable Key (pk_test_...)
- [ ] Copy Secret Key (sk_test_...)
- [ ] Keep test keys for development
- [ ] Store production keys securely

#### D. Configure Webhooks
```
Endpoint URL: https://your-domain.com/api/stripe/webhook
Events to listen for:
- payment_intent.succeeded
- payment_intent.payment_failed
- account.updated
- account.application.deauthorized
- transfer.created
- payout.paid
```

- [ ] Webhook endpoint created
- [ ] Signing secret saved
- [ ] Test webhook event successful

#### E. Set Up Connect Settings
- [ ] Platform fee: 5% application fee
- [ ] Payout schedule: Daily
- [ ] Enable instant payouts (optional)

### 3. Environment Variables

Create `.env` file:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
VITE_STRIPE_CONNECT_CLIENT_ID=ca_xxxxx

# Application
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Alaska Guide Search

# Optional - for production
VITE_SENTRY_DSN=
VITE_GOOGLE_ANALYTICS_ID=
```

Do not expose Stripe secret keys in frontend `VITE_*` variables.

- [ ] All environment variables set
- [ ] .env added to .gitignore
- [ ] Production variables in hosting platform

### 4. Backend API Endpoints

Create these endpoints (Next.js API routes, Express, or Supabase Edge Functions):

#### A. Payment Endpoints
```
POST /api/bookings/create-deposit-payment
POST /api/bookings/create-remainder-payment
POST /api/bookings/{id}/confirm-deposit
POST /api/bookings/{id}/complete-payment
GET /api/payment-methods?client_id={id}
```

- [ ] All payment endpoints created
- [ ] Stripe secret key configured
- [ ] Error handling implemented
- [ ] Logging enabled

#### B. Stripe Connect Endpoints
```
POST /api/guides/connect-account
GET /api/guides/connect-status
POST /api/guides/create-payout
```

- [ ] Connect onboarding flow working
- [ ] Account status check implemented
- [ ] Payout creation functional

#### C. Webhook Handler
```
POST /api/stripe/webhook
```

- [ ] Webhook signature verification
- [ ] Event handlers for all event types
- [ ] Database updates on events
- [ ] Error notifications

### 5. Email Configuration (Optional)

#### Using Resend (Recommended)
```bash
npm install resend
```

- [ ] Resend account created
- [ ] API key added to environment
- [ ] Email templates created:
  - [ ] Booking confirmation
  - [ ] 7-day reminder
  - [ ] 3-day reminder
  - [ ] 1-day reminder
  - [ ] Check-in instructions
  - [ ] Review request
  - [ ] Payment receipt

### 6. Build & Test

#### A. Install Dependencies
```bash
npm install
```

- [ ] All packages installed
- [ ] No peer dependency warnings
- [ ] Package-lock.json committed

#### B. Run Development Server
```bash
npm run dev
```

- [ ] Server starts successfully
- [ ] No console errors
- [ ] All routes accessible

#### C. Build for Production
```bash
npm run build
```

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Bundle size acceptable (< 2MB)
- [ ] All assets optimized

#### D. Test Core Flows

**Customer Flow:**
- [ ] Browse guides
- [ ] Select service and date
- [ ] Complete booking (test card: 4242 4242 4242 4242)
- [ ] Receive confirmation
- [ ] View booking in dashboard
- [ ] Check in with QR code
- [ ] Leave review

**Guide Flow:**
- [ ] Register as guide
- [ ] Connect Stripe account
- [ ] Create service
- [ ] Set availability
- [ ] Upload photos/videos
- [ ] Receive booking
- [ ] Accept booking
- [ ] Check in customer
- [ ] View analytics

**Admin Flow:**
- [ ] Access admin dashboard
- [ ] View all bookings
- [ ] Approve guide
- [ ] View revenue
- [ ] Handle dispute
- [ ] Update settings

## 🌐 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

- [ ] Project linked to Vercel
- [ ] Environment variables configured
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Deployment successful

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
npm run build
netlify deploy --prod --dir=dist
```

- [ ] Project linked to Netlify
- [ ] Environment variables set
- [ ] Domain configured
- [ ] Deploy successful

### Option 3: Custom Server

```bash
npm run build
# Copy dist/ folder to your server
# Serve with nginx, Apache, or Node.js
```

- [ ] Server configured
- [ ] SSL certificate installed
- [ ] Firewall rules set
- [ ] Deployment complete

## 🔒 Security Checklist

- [ ] HTTPS enforced on all pages
- [ ] Environment variables not exposed to client
- [ ] RLS policies tested and working
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Secure headers configured
- [ ] Dependencies updated (npm audit)
- [ ] Error messages don't expose sensitive data

## 📊 Monitoring & Analytics

### Recommended Tools

#### Error Tracking
- [ ] Sentry configured
- [ ] Error boundaries reporting
- [ ] Source maps uploaded

#### Analytics
- [ ] Google Analytics installed
- [ ] Custom events tracking:
  - [ ] Bookings created
  - [ ] Payments processed
  - [ ] Guide registrations
  - [ ] Service views

#### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Images optimized
- [ ] Code splitting enabled

#### Uptime Monitoring
- [ ] UptimeRobot or Pingdom configured
- [ ] Alert emails set up
- [ ] Status page created

## 🎯 Post-Launch Tasks

### First Week
- [ ] Monitor error logs daily
- [ ] Check payment processing
- [ ] Review user feedback
- [ ] Test all critical flows
- [ ] Update documentation

### First Month
- [ ] Analyze booking patterns
- [ ] Review guide approval times
- [ ] Check conversion rates
- [ ] Optimize slow queries
- [ ] Add requested features

### Ongoing
- [ ] Weekly database backups
- [ ] Monthly security audits
- [ ] Quarterly dependency updates
- [ ] Review and optimize costs
- [ ] Customer satisfaction surveys

## 📱 Mobile App (Future)

If building native apps:
- [ ] React Native or Flutter setup
- [ ] Mobile-specific UI optimizations
- [ ] Push notifications
- [ ] Camera integration for QR scanning
- [ ] Offline mode for essential features

## 🧪 Testing

### Manual Testing
- [ ] All user flows tested
- [ ] Edge cases handled
- [ ] Error states verified
- [ ] Mobile responsive confirmed
- [ ] Accessibility checked

### Automated Testing (Optional)
- [ ] Unit tests for utilities
- [ ] Integration tests for API
- [ ] E2E tests for booking flow
- [ ] Performance tests

## 📄 Documentation

- [ ] README.md up to date
- [ ] API documentation complete
- [ ] User guide created
- [ ] Guide onboarding docs
- [ ] Admin manual written
- [ ] Troubleshooting guide

## 🎊 Launch!

- [ ] Final security review
- [ ] Database backup created
- [ ] Monitoring dashboards ready
- [ ] Support email configured
- [ ] Marketing materials ready
- [ ] Press release prepared
- [ ] Launch announcement posted
- [ ] Team notified

## 🆘 Support

### If Issues Arise

1. **Check Logs:**
   - Vercel/Netlify deployment logs
   - Supabase database logs
   - Stripe Dashboard logs
   - Browser console errors

2. **Review Documentation:**
   - PRODUCTION_README.md
   - Component-specific READMEs
   - Supabase docs
   - Stripe docs

3. **Common Issues:**
   - **Build fails:** Check TypeScript errors, missing dependencies
   - **Database errors:** Verify RLS policies, check migrations
   - **Payment fails:** Verify Stripe keys, check webhook events
   - **Images not loading:** Check Storage bucket permissions

4. **Get Help:**
   - Supabase Discord
   - Stripe support
   - Stack Overflow
   - Development team

---

## ✅ Final Checklist

Before going live:

- [ ] All above items completed
- [ ] Test data cleared from database
- [ ] Production environment variables set
- [ ] SSL certificates active
- [ ] Monitoring enabled
- [ ] Backup system configured
- [ ] Support channels ready
- [ ] Legal pages (Privacy, Terms) live
- [ ] Payment processing tested end-to-end
- [ ] Mobile experience verified

**Ready to launch! 🚀**

---

**Built with ❄️ for Alaska's finest outdoor guides**
