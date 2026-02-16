# Notification System - Quick Reference

## 📁 File Structure (992 total lines)

```
src/components/notifications/
├── index.ts                    (5 lines)      - Barrel exports
├── useNotifications.ts         (238 lines)    - Custom React hook
├── NotificationBell.tsx        (140 lines)    - Header bell component
├── NotificationCenter.tsx      (288 lines)    - Full page component  
├── NotificationItem.tsx        (79 lines)     - Notification card
├── examples.tsx                (242 lines)    - Usage examples
├── migration.sql               (161 lines)    - Database schema
├── README.md                   (283 lines)    - Full documentation
└── INSTALLATION.md             (276 lines)    - Setup guide
```

## 🎯 Component API

### NotificationBell
```tsx
<NotificationBell 
  userId="user-123"      // Required: User's ID
  maxDisplay={5}         // Optional: Max notifications in dropdown (default: 5)
/>
```

**Returns:**
- Bell icon with badge
- Unread count (99+ cap)
- Real-time indicator
- Dropdown menu on click

### NotificationCenter  
```tsx
<NotificationCenter 
  userId="user-123"      // Required: User's ID
/>
```

**Returns:**
- Full-page notification interface
- Tabs: All, Unread, Bookings, Messages
- Bulk actions
- Real-time updates

### useNotifications Hook
```tsx
const {
  notifications,         // Array of notifications
  unreadCount,          // Number of unread
  isLoading,            // Loading state
  error,                // Error state
  realtimeEnabled,      // Connection status
  markAsRead,           // (id: string) => void
  markAllAsRead,        // () => void
  deleteNotification,   // (id: string) => void
  deleteAllNotifications, // () => void
  isMarkingAsRead,      // Boolean
  isDeleting,           // Boolean
} = useNotifications(userId);
```

## 🎨 Notification Type Reference

```typescript
type NotificationType = 
  | 'booking_request'     // 📅 Blue calendar
  | 'booking_confirmed'   // ✅ Green check
  | 'booking_cancelled'   // ❌ Red X
  | 'message'             // 💬 Purple message
  | 'review'              // ⭐ Yellow star
  | 'payment'             // 💳 Green card

interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  created_at: string;
  related_id?: string;      // UUID of related item
  related_type?: string;    // 'booking', 'message', 'guide'
}
```

## 💾 Database Quick Reference

### Create Notification
```typescript
await supabase.from('notifications').insert({
  user_id: 'user-id',
  type: 'booking_request',
  title: 'Title',
  message: 'Message',
  related_type: 'booking',    // Optional
  related_id: 'booking-id',   // Optional
  data: { key: 'value' }      // Optional JSONB
});
```

### Query Notifications
```typescript
const { data } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

### Mark as Read
```typescript
await supabase
  .from('notifications')
  .update({ read: true })
  .eq('id', notificationId);
```

### Delete Notification
```typescript
await supabase
  .from('notifications')
  .delete()
  .eq('id', notificationId);
```

## 🔌 Real-time Setup

### Enable in Supabase Dashboard
1. Database → Replication
2. Find `notifications` table
3. Toggle replication ON
4. Save changes

### Verify Connection
- Look for green pulsing dot on NotificationBell
- Check `realtimeEnabled` state in hook
- Test by creating notification in another tab

## 🚀 Common Use Cases

### 1. New Booking Request
```typescript
await supabase.from('notifications').insert({
  user_id: guide.id,
  type: 'booking_request',
  title: 'New Booking Request',
  message: `${customer.name} wants to book ${service.name}`,
  related_type: 'booking',
  related_id: booking.id
});
```

### 2. Booking Confirmed
```typescript
await supabase.from('notifications').insert({
  user_id: customer.id,
  type: 'booking_confirmed',
  title: 'Booking Confirmed!',
  message: `Your ${service.name} booking is confirmed`,
  related_type: 'booking',
  related_id: booking.id
});
```

### 3. New Message
```typescript
await supabase.from('notifications').insert({
  user_id: recipient.id,
  type: 'message',
  title: 'New Message',
  message: `${sender.name}: ${preview}`,
  related_type: 'message',
  related_id: message.id
});
```

### 4. Payment Received
```typescript
await supabase.from('notifications').insert({
  user_id: guide.id,
  type: 'payment',
  title: 'Payment Received',
  message: `You received $${amount}`,
  related_type: 'booking',
  related_id: booking.id,
  data: { amount, currency: 'USD' }
});
```

## 🔧 Database Triggers

### Auto-notify on new booking
```sql
CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_guide_new_booking();
```

### Auto-notify on status change
```sql
CREATE TRIGGER on_booking_confirmed
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (OLD.status != NEW.status)
  EXECUTE FUNCTION notify_status_change();
```

## 📊 Performance Tips

✅ Indexes are auto-created by migration  
✅ Use pagination for large lists  
✅ React Query caches automatically  
✅ Real-time subscriptions auto-cleanup  
✅ RLS prevents unauthorized access  

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| No real-time updates | Enable replication in Supabase |
| Notifications not showing | Check RLS policies & user_id |
| TypeScript errors | Ensure shadcn/ui installed |
| Connection fails | Check Supabase URL/keys |
| Slow queries | Indexes auto-created, check network |

## 📖 Documentation Files

- **README.md** - Complete API docs
- **INSTALLATION.md** - Setup guide
- **examples.tsx** - Code examples
- **migration.sql** - Database setup
- **QUICK_REFERENCE.md** - This file

## ✨ Features Checklist

- [x] Real-time updates
- [x] Unread count badge
- [x] Mark as read
- [x] Delete notifications
- [x] Filter by type
- [x] Click to navigate
- [x] Toast notifications
- [x] Loading states
- [x] Error handling
- [x] Empty states
- [x] Responsive design
- [x] TypeScript types
- [x] RLS security
- [x] Performance optimized
- [x] Production ready

---

**Ready to use!** See INSTALLATION.md for setup steps.
