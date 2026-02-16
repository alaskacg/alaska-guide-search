# Alaska Guide Search - Admin Dashboard

A comprehensive admin dashboard for managing the Alaska Guide Search platform. Built with React, TypeScript, shadcn/ui, and React Query.

## 📁 Files Created

All files are located in `/src/pages/admin/`:

1. **AdminDashboard.tsx** - Main admin layout with navigation sidebar
2. **AllBookings.tsx** - Bookings management with filters and bulk actions
3. **GuideApproval.tsx** - Guide verification queue and approval workflow
4. **RevenueAnalytics.tsx** - Platform-wide revenue metrics with charts
5. **DisputeManagement.tsx** - Customer dispute handling and resolution
6. **PlatformSettings.tsx** - Platform configuration editor
7. **index.ts** - Barrel export for easy imports

## 🎯 Features

### AdminDashboard
- **Admin-only access** with user_type verification
- Responsive sidebar navigation
- Mobile-friendly with Sheet component
- User profile display and sign-out

### AllBookings
- Advanced filtering (status, date range, search)
- Bulk actions (confirm, cancel multiple bookings)
- CSV export functionality
- Real-time statistics cards
- Detailed booking view dialog
- Optimistic updates with React Query

### GuideApproval
- Application queue with status filtering
- Document viewer for verification files
- Approve/reject workflow with notes
- Automatic guide profile creation on approval
- Tabbed interface for details, documents, and review

### RevenueAnalytics
- Interactive charts (Line, Bar, Pie) using recharts
- Daily revenue trends
- Category breakdown
- Top performing guides
- Key metrics: total revenue, platform fees, guide earnings
- CSV export

### DisputeManagement
- Dispute filtering by status and priority
- Resolution workflow with notes
- Refund amount calculator
- Status badges and priority indicators
- Booking information context

### PlatformSettings
- Tabbed settings interface:
  - General: Platform info, maintenance mode
  - Fees & Payments: Fee structure, payouts
  - Booking Policies: Advance booking, cancellation
  - Verification: Guide requirements
  - Legal: Terms and privacy URLs
- Unsaved changes indicator
- Reset and save functionality

## 🚀 Setup Instructions

### 1. Database Schema

You need to ensure the following tables exist in your Supabase database:

#### Required Tables (Already Exist)
- `profiles` (with `user_type` column for admin check)
- `bookings`
- `guide_applications`
- `guide_profiles`
- `guide_listings`

#### Optional Tables (Create if needed)

**disputes table:**
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

**platform_config table:**
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

### 2. Update Profiles Table

Ensure the `profiles` table has a `user_type` column:

```sql
-- Add user_type column if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'client' 
CHECK (user_type IN ('client', 'guide', 'admin'));

-- Create an admin user (replace with your user ID)
UPDATE profiles 
SET user_type = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 3. Add to Router

Update your `App.tsx` or router configuration:

```tsx
import { AdminDashboard, AllBookings, GuideApproval, RevenueAnalytics, DisputeManagement, PlatformSettings } from '@/pages/admin';

// In your routes:
{
  path: '/admin',
  element: <AdminDashboard />,
  children: [
    { index: true, element: <RevenueAnalytics /> }, // Default view
    { path: 'bookings', element: <AllBookings /> },
    { path: 'approvals', element: <GuideApproval /> },
    { path: 'revenue', element: <RevenueAnalytics /> },
    { path: 'disputes', element: <DisputeManagement /> },
    { path: 'settings', element: <PlatformSettings /> },
  ],
}
```

### 4. Verify Dependencies

All required dependencies are already in package.json:
- ✅ @tanstack/react-query
- ✅ recharts
- ✅ date-fns
- ✅ lucide-react
- ✅ All shadcn/ui components

### 5. Access the Dashboard

1. Sign in as a user with `user_type = 'admin'`
2. Navigate to `/admin` in your application
3. You should see the admin dashboard with full navigation

## 🔐 Security

- **Admin-only access**: Checks `user_type = 'admin'` on page load
- **Automatic redirect**: Non-admin users are redirected to home
- **Row Level Security**: Implement RLS policies on Supabase tables
- **API validation**: Add backend validation for all mutations

## 📊 Data Flow

1. **React Query** handles all data fetching with caching
2. **Optimistic updates** for better UX on mutations
3. **Real-time stats** with configurable refetch intervals
4. **Error handling** with toast notifications

## 🎨 UI Components Used

From shadcn/ui:
- Button, Input, Textarea, Label
- Card, Badge, Alert
- Table, Dialog, Sheet
- Select, Checkbox, Switch
- Tabs, Separator, Tooltip

## 📈 Charts

Using **recharts** library:
- LineChart - Revenue trends over time
- BarChart - Top guides by revenue
- PieChart - Category revenue breakdown

## 🔧 Customization

### Adding New Settings
Edit `PlatformSettings.tsx` and add to the `PlatformConfig` interface:

```tsx
interface PlatformConfig {
  // ... existing fields
  your_new_setting: string;
}
```

### Adding New Filters
In any list view (bookings, disputes, etc.), add to the filter section:

```tsx
<Select value={yourFilter} onValueChange={setYourFilter}>
  <SelectItem value="option1">Option 1</SelectItem>
</Select>
```

### Custom Charts
Import recharts components and add to RevenueAnalytics:

```tsx
import { AreaChart, Area } from 'recharts';
```

## 🐛 Troubleshooting

### "Access Denied" when navigating to /admin
- Ensure your user has `user_type = 'admin'` in the profiles table
- Check browser console for authentication errors

### "Table does not exist" errors
- Create the optional tables (disputes, platform_config) as shown above
- The components will gracefully handle missing tables

### Charts not showing
- Check browser console for data fetching errors
- Verify bookings data exists in your database
- Ensure date filtering is working correctly

## 📝 Next Steps

1. **Create admin user**: Update a profile to have `user_type = 'admin'`
2. **Create optional tables**: Run SQL for disputes and platform_config
3. **Test access**: Navigate to `/admin` and verify all features
4. **Configure RLS**: Add Row Level Security policies for production
5. **Customize branding**: Update colors, logos, and text as needed

## 🎯 Production Checklist

- [ ] Add Row Level Security (RLS) policies to all tables
- [ ] Implement audit logging for admin actions
- [ ] Add email notifications for important events
- [ ] Set up monitoring and error tracking
- [ ] Configure backup and recovery procedures
- [ ] Add rate limiting on sensitive mutations
- [ ] Implement two-factor authentication for admin users
- [ ] Review and test all permission checks

## 📚 Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Recharts Documentation](https://recharts.org/)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Built with ❤️ for Alaska Guide Search**
