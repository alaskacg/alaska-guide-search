# 🚀 Admin Dashboard Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### Step 1: Create Admin User (1 min)

Open Supabase SQL Editor and run:

```sql
-- Make yourself an admin
UPDATE profiles 
SET user_type = 'admin' 
WHERE email = 'YOUR_EMAIL@example.com';
```

### Step 2: Add Routes (2 min)

In your `App.tsx` or router file, add:

```tsx
import {
  AdminDashboard,
  AllBookings,
  GuideApproval,
  RevenueAnalytics,
  DisputeManagement,
  PlatformSettings,
} from '@/pages/admin';

// Add to your routes:
{
  path: '/admin',
  element: <AdminDashboard />,
  children: [
    { index: true, element: <RevenueAnalytics /> },
    { path: 'bookings', element: <AllBookings /> },
    { path: 'approvals', element: <GuideApproval /> },
    { path: 'revenue', element: <RevenueAnalytics /> },
    { path: 'disputes', element: <DisputeManagement /> },
    { path: 'settings', element: <PlatformSettings /> },
  ],
}
```

### Step 3: Test Access (1 min)

1. Sign in with your admin email
2. Navigate to `/admin` in your browser
3. You should see the admin dashboard! 🎉

### Step 4 (Optional): Create Additional Tables (1 min)

For full functionality, create these optional tables in Supabase:

**Disputes Table:**
```sql
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id),
  dispute_type TEXT,
  status TEXT CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  raised_by UUID REFERENCES profiles(id),
  raised_by_type TEXT CHECK (raised_by_type IN ('client', 'guide')),
  subject TEXT NOT NULL,
  description TEXT,
  resolution_notes TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Platform Config Table:**
```sql
CREATE TABLE platform_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_fee_percentage DECIMAL(5,2) DEFAULT 15,
  min_booking_advance_hours INTEGER DEFAULT 24,
  max_booking_advance_days INTEGER DEFAULT 365,
  default_cancellation_policy TEXT DEFAULT 'moderate',
  auto_approve_guides BOOLEAN DEFAULT FALSE,
  require_insurance_verification BOOLEAN DEFAULT TRUE,
  require_background_check BOOLEAN DEFAULT TRUE,
  min_guide_experience_years INTEGER DEFAULT 1,
  customer_support_email TEXT,
  platform_name TEXT DEFAULT 'Alaska Guide Search',
  refund_processing_days INTEGER DEFAULT 7,
  dispute_resolution_days INTEGER DEFAULT 14,
  guide_payout_schedule TEXT DEFAULT 'weekly',
  platform_currency TEXT DEFAULT 'USD',
  tax_rate_percentage DECIMAL(5,2) DEFAULT 0,
  service_fee_cap_amount DECIMAL(10,2),
  terms_of_service_url TEXT,
  privacy_policy_url TEXT,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  featured_listing_fee DECIMAL(10,2) DEFAULT 49.99,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default config
INSERT INTO platform_config (platform_name, customer_support_email)
VALUES ('Alaska Guide Search', 'support@alaskaguidesearch.com');
```

## ✅ What Works Right Now (Without Optional Tables)

Even without creating the optional tables, you get:

✅ **AdminDashboard** - Full navigation and layout  
✅ **AllBookings** - Manage all bookings (if bookings table exists)  
✅ **GuideApproval** - Review guide applications (if guide_applications exists)  
✅ **RevenueAnalytics** - Revenue charts and metrics (if bookings exist)  
❌ **DisputeManagement** - Requires disputes table  
❌ **PlatformSettings** - Requires platform_config table  

## 🎯 Admin Dashboard Features

### Navigation
- Sidebar with 6 menu items
- Mobile responsive with hamburger menu
- Active state highlighting
- User profile with avatar

### All Bookings
- Search and filter bookings
- Bulk select and actions
- Export to CSV
- Detailed booking view
- Status management

### Guide Approvals  
- Review pending applications
- View uploaded documents
- Approve/reject with notes
- Auto-create guide profile

### Revenue Analytics
- Interactive charts (Line, Bar, Pie)
- Revenue trends over time
- Category breakdown
- Top performing guides
- Export data to CSV

### Dispute Management
- Filter by status and priority
- Review dispute details
- Add resolution notes
- Process refunds
- Update booking status

### Platform Settings
- 5 organized tabs
- Platform configuration
- Fee structure
- Booking policies
- Guide verification rules
- Legal document URLs

## 🔐 Security

The dashboard automatically:
- Checks if user is logged in
- Verifies `user_type = 'admin'`
- Redirects non-admin users to home
- Shows access denied toast

## 📚 Documentation

For detailed information, see:
- `README.md` - Full documentation
- `router-example.tsx` - Router examples
- `ADMIN_DASHBOARD_SUMMARY.md` - Feature overview

## 🐛 Troubleshooting

**Can't access /admin?**
- Make sure you're logged in
- Check that your user has `user_type = 'admin'`
- Look in browser console for errors

**Seeing "table does not exist" errors?**
- Some features require optional tables (see Step 4)
- Check Supabase logs for specific table names

**Charts not loading?**
- Ensure you have booking data in your database
- Check network tab for API errors
- Verify Supabase connection

## 🎨 Customization

All pages use shadcn/ui components, so you can:
- Change colors in tailwind.config
- Modify component variants
- Add custom styling
- Extend functionality

## 📞 Need Help?

1. Check `README.md` for detailed docs
2. Review console for errors
3. Verify database schema matches requirements
4. Ensure all dependencies are installed

---

**You're all set! Navigate to `/admin` and start managing your platform.** 🎉
