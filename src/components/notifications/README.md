# Notification System

A production-ready notification system with real-time updates using Supabase Realtime.

## Components

### 1. NotificationBell.tsx
A bell icon component that displays in the header/navbar with:
- **Unread count badge** - Shows number of unread notifications (99+ cap)
- **Real-time indicator** - Green pulsing dot when connected to Supabase Realtime
- **Dropdown menu** - Click to view recent notifications (default: 5 most recent)
- **Auto-navigation** - Click notification to navigate to related item
- **Mark as read** - Automatically marks as read when clicked

**Usage:**
```tsx
import { NotificationBell } from '@/components/notifications';

<NotificationBell userId={user?.id} maxDisplay={5} />
```

**Props:**
- `userId` (string, optional) - Current user's ID
- `maxDisplay` (number, optional) - Number of notifications to show in dropdown (default: 5)

### 2. NotificationCenter.tsx
Full-page notification management interface with:
- **Tabs**: All, Unread, Bookings, Messages
- **Notification cards** - Color-coded icons by type
- **Bulk actions** - Mark all as read, Clear all
- **Individual actions** - Delete notification on hover
- **Real-time updates** - Live badge indicator
- **Empty states** - Contextual messages for each tab
- **Responsive design** - Works on mobile and desktop

**Usage:**
```tsx
import { NotificationCenter } from '@/components/notifications';

<NotificationCenter userId={user?.id} />
```

**Props:**
- `userId` (string, optional) - Current user's ID

### 3. NotificationItem.tsx
Reusable notification card component with:
- **Type-based icons** - Different icons/colors for each notification type
- **Time formatting** - "5 minutes ago" format using date-fns
- **Unread indicator** - Blue background and dot for unread items
- **Click handler** - Customizable onClick behavior

**Usage:**
```tsx
import { NotificationItem } from '@/components/notifications';

<NotificationItem 
  notification={notification}
  onClick={() => handleClick(notification)}
/>
```

### 4. useNotifications.ts
Custom React hook that provides:
- **Real-time subscriptions** - Automatically subscribes to notification changes
- **Queries**:
  - `notifications` - All notifications for user
  - `unreadCount` - Count of unread notifications
- **Mutations**:
  - `markAsRead(id)` - Mark single notification as read
  - `markAllAsRead()` - Mark all as read
  - `deleteNotification(id)` - Delete single notification
  - `deleteAllNotifications()` - Delete all notifications
- **State**:
  - `isLoading` - Loading state
  - `error` - Error state
  - `realtimeEnabled` - Real-time connection status

**Usage:**
```tsx
import { useNotifications } from '@/components/notifications';

const { 
  notifications, 
  unreadCount, 
  markAsRead,
  realtimeEnabled 
} = useNotifications(userId);
```

## Notification Types

```typescript
type NotificationType = 
  | 'booking_request'    // Blue calendar icon
  | 'booking_confirmed'  // Green checkmark icon
  | 'booking_cancelled'  // Red X icon
  | 'message'            // Purple message icon
  | 'review'             // Yellow star icon
  | 'payment'            // Green credit card icon
```

## Database Schema

The notification system expects a `notifications` table with the following structure:

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB,
  related_id UUID,
  related_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);
```

## Real-time Setup

Enable real-time on the notifications table in Supabase:

1. Go to Database → Replication
2. Enable replication for `notifications` table
3. The hook automatically subscribes to changes

## Navigation Integration

Notifications automatically navigate to related items based on `related_type`:

- `booking` → `/bookings/{related_id}`
- `message` → `/messages/{related_id}`
- `guide` → `/guides/{related_id}`

Update the navigation logic in `NotificationBell.tsx` and `NotificationCenter.tsx` to match your routes.

## Creating Notifications

To create notifications from your backend or database triggers:

```typescript
// Client-side (requires appropriate RLS policy)
const { data, error } = await supabase
  .from('notifications')
  .insert({
    user_id: recipientUserId,
    type: 'booking_request',
    title: 'New Booking Request',
    message: 'You have a new booking request for Alaska Fishing Trip',
    related_type: 'booking',
    related_id: bookingId,
    data: { /* additional data */ }
  });
```

```sql
-- Database trigger example
CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
  VALUES (
    NEW.guide_id,
    'booking_request',
    'New Booking Request',
    'You have a new booking request',
    'booking',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_booking();
```

## Features

✅ Real-time updates via Supabase Realtime  
✅ Unread count badge  
✅ Toast notifications for new items  
✅ Mark as read functionality  
✅ Bulk operations  
✅ Delete notifications  
✅ Type-based filtering  
✅ Click to navigate  
✅ Responsive design  
✅ Loading and error states  
✅ Empty states  
✅ Production-ready with TypeScript  
✅ Accessible UI with shadcn/ui  

## Dependencies

Required packages (already in your project):
- `@tanstack/react-query` - State management
- `@supabase/supabase-js` - Database and realtime
- `lucide-react` - Icons
- `date-fns` - Date formatting
- shadcn/ui components:
  - `button`, `badge`, `card`, `tabs`, `popover`, `scroll-area`
  - `separator`, `alert-dialog`, `toast`

## Example Integration

Add to your header/navbar:

```tsx
import { NotificationBell } from '@/components/notifications';
import { useAuth } from '@/hooks/useAuth'; // Your auth hook

export const Header = () => {
  const { user } = useAuth();
  
  return (
    <header>
      <nav>
        {/* ... other nav items ... */}
        <NotificationBell userId={user?.id} />
      </nav>
    </header>
  );
};
```

Add a notifications page route:

```tsx
import { NotificationCenter } from '@/components/notifications';

export const NotificationsPage = () => {
  const { user } = useAuth();
  return <NotificationCenter userId={user?.id} />;
};
```

## Customization

### Change notification colors/icons
Edit `NotificationItem.tsx` → `getNotificationIcon()` function

### Add new notification types
1. Add type to `NotificationType` in `useNotifications.ts`
2. Add icon mapping in `NotificationItem.tsx`
3. Update filtering logic in `NotificationCenter.tsx` if needed

### Customize navigation
Update `handleNotificationClick` in both `NotificationBell.tsx` and `NotificationCenter.tsx`

## Performance

- Uses React Query for efficient caching and automatic refetching
- Real-time subscriptions are properly cleaned up on unmount
- Pagination ready (add pagination to queries as needed)
- Optimistic updates for better UX
- Debounced/throttled updates to prevent excessive re-renders
