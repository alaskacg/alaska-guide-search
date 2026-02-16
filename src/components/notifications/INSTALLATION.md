# Notification System - Installation & Setup Guide

## ✅ Files Created

All notification system files have been created in `/src/components/notifications/`:

```
src/components/notifications/
├── index.ts                  # Main exports
├── useNotifications.ts       # Custom hook with real-time subscriptions
├── NotificationBell.tsx      # Header bell component with dropdown
├── NotificationCenter.tsx    # Full notifications page
├── NotificationItem.tsx      # Reusable notification card
├── README.md                 # Full documentation
├── examples.tsx              # Usage examples
└── migration.sql             # Database schema and triggers
```

## 🚀 Quick Start

### Step 1: Set up the database

Run the migration in your Supabase SQL editor:

```bash
# Copy the SQL from migration.sql and run in Supabase Dashboard > SQL Editor
```

Or via CLI:
```bash
supabase db push src/components/notifications/migration.sql
```

### Step 2: Enable Realtime on Supabase

1. Go to **Database → Replication** in Supabase Dashboard
2. Enable replication for the `notifications` table
3. Click "Save" to apply changes

### Step 3: Add NotificationBell to your header

```tsx
// src/components/Header.tsx
import { NotificationBell } from '@/components/notifications';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const Header = () => {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  return (
    <header className="border-b">
      <nav className="container flex items-center justify-between py-4">
        <div>Your Logo</div>
        <div className="flex items-center gap-4">
          <a href="/dashboard">Dashboard</a>
          <NotificationBell userId={userId} />
          {/* Other nav items */}
        </div>
      </nav>
    </header>
  );
};
```

### Step 4: Add a notifications page route

```tsx
// src/App.tsx or your router file
import { NotificationCenter } from '@/components/notifications';

// Add to your routes:
<Route path="/notifications" element={<NotificationsPage />} />

// NotificationsPage component:
const NotificationsPage = () => {
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id);
    });
  }, []);

  return <NotificationCenter userId={userId} />;
};
```

### Step 5: Create test notifications

```tsx
import { supabase } from '@/integrations/supabase/client';

// Create a test notification
const createTestNotification = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    await supabase.from('notifications').insert({
      user_id: user.id,
      type: 'booking_request',
      title: 'Test Notification',
      message: 'This is a test notification with real-time updates!',
      related_type: 'booking',
      related_id: crypto.randomUUID(),
    });
  }
};
```

## 🎨 Features Overview

### NotificationBell
- ✅ Real-time unread count badge
- ✅ Live connection indicator (green pulsing dot)
- ✅ Dropdown with recent notifications
- ✅ Click to view full notification center
- ✅ Auto-navigation to related items

### NotificationCenter
- ✅ Tabbed interface (All, Unread, Bookings, Messages)
- ✅ Mark all as read button
- ✅ Clear all notifications
- ✅ Delete individual notifications
- ✅ Real-time updates
- ✅ Empty states for each tab
- ✅ Responsive design

### useNotifications Hook
- ✅ Real-time Supabase subscriptions
- ✅ React Query caching
- ✅ Optimistic updates
- ✅ Toast notifications for new items
- ✅ TypeScript type safety

## 📊 Database Schema

The migration creates:

1. **notifications table** with columns:
   - `id`, `user_id`, `type`, `title`, `message`
   - `read`, `data` (JSONB), `related_id`, `related_type`
   - `created_at`

2. **Indexes** for performance:
   - User ID, read status, created date, type

3. **Row Level Security (RLS)** policies:
   - Users can only view/update/delete their own notifications
   - System can create notifications

4. **Database Functions**:
   - `create_notification()` - Helper to create notifications
   - `delete_old_notifications()` - Cleanup old notifications (90+ days)

5. **Triggers** (examples included):
   - Notify guide on new bookings
   - Notify customer on booking confirmation

## 🔧 Customization

### Add new notification types

1. Update type in `useNotifications.ts`:
```typescript
export type NotificationType = 
  | 'booking_request'
  | 'booking_confirmed'
  | 'your_new_type';  // Add here
```

2. Add icon in `NotificationItem.tsx`:
```typescript
case 'your_new_type':
  return <YourIcon className={cn(iconClass, "text-blue-500")} />;
```

3. Update database constraint in `migration.sql`

### Customize navigation

Edit `handleNotificationClick` in both `NotificationBell.tsx` and `NotificationCenter.tsx`:

```typescript
case 'your_type':
  navigate(`/your-route/${notification.related_id}`);
  break;
```

## 🧪 Testing

### Test real-time updates

1. Open app in two browser windows/tabs
2. Log in as the same user
3. Create a notification in one window:
   ```tsx
   await supabase.from('notifications').insert({
     user_id: userId,
     type: 'message',
     title: 'Real-time Test',
     message: 'This should appear instantly!',
   });
   ```
4. Watch it appear in the other window immediately!

### Test notification types

See `examples.tsx` for code samples to create each notification type.

## 🔐 Security

- ✅ Row Level Security enabled
- ✅ Users can only access their own notifications
- ✅ Protected against SQL injection
- ✅ XSS protection via React's built-in escaping
- ✅ CSRF protection via Supabase auth

## 📱 Production Checklist

- [ ] Database migration applied
- [ ] Realtime enabled on notifications table
- [ ] NotificationBell added to header
- [ ] Notifications page route created
- [ ] Database triggers set up for your use cases
- [ ] Tested real-time updates
- [ ] Tested on mobile devices
- [ ] Set up notification cleanup (optional)
- [ ] Error tracking configured
- [ ] Analytics events added (optional)

## 🐛 Troubleshooting

### Real-time not working
1. Check if realtime is enabled in Supabase Dashboard
2. Verify network connection (check browser console)
3. Look for the green pulsing dot on NotificationBell
4. Check browser console for subscription errors

### Notifications not appearing
1. Verify RLS policies are correct
2. Check that `user_id` matches authenticated user
3. Verify notification was created (check Supabase dashboard)
4. Check React Query DevTools for cache state

### TypeScript errors
1. Ensure all shadcn/ui components are installed
2. Run `npm install` to ensure dependencies are up to date
3. Check that paths in tsconfig.json are correct (@/* alias)

## 📚 Additional Resources

- [Supabase Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [React Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🎉 You're Done!

The notification system is now ready to use. Check `examples.tsx` for implementation examples.

### Next Steps:
1. Create notification triggers for your specific use cases
2. Customize the navigation logic for your routes
3. Add analytics tracking for notification interactions
4. Set up email/push notifications (optional)
5. Implement notification preferences (optional)

---

**Need help?** Check the README.md and examples.tsx for detailed documentation and code samples.
