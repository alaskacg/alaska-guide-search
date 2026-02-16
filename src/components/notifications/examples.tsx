/**
 * Example: How to integrate the Notification System
 * 
 * This file demonstrates how to use the notification components
 * in your application. Copy and adapt these examples to your needs.
 */

import { NotificationBell, NotificationCenter } from '@/components/notifications';

// ============================================
// Example 1: Add NotificationBell to Header
// ============================================
export const HeaderExample = () => {
  // Assuming you have a user context or auth hook
  const user = { id: 'user-123' }; // Replace with your actual user state
  
  return (
    <header className="border-b">
      <nav className="container flex items-center justify-between py-4">
        <div className="text-xl font-bold">Alaska Guide Search</div>
        
        <div className="flex items-center gap-4">
          <a href="/dashboard">Dashboard</a>
          <a href="/bookings">Bookings</a>
          
          {/* Add notification bell to header */}
          <NotificationBell 
            userId={user.id} 
            maxDisplay={5}  // Show 5 most recent in dropdown
          />
          
          <button>Profile</button>
        </div>
      </nav>
    </header>
  );
};

// ============================================
// Example 2: Dedicated Notifications Page
// ============================================
export const NotificationsPageExample = () => {
  const user = { id: 'user-123' }; // Replace with your actual user state
  
  return (
    <div className="min-h-screen bg-background">
      <NotificationCenter userId={user.id} />
    </div>
  );
};

// ============================================
// Example 3: Use the hook directly
// ============================================
import { useNotifications } from '@/components/notifications';

export const CustomNotificationComponent = () => {
  const userId = 'user-123'; // Replace with actual user ID
  
  const {
    notifications,
    unreadCount,
    isLoading,
    realtimeEnabled,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications(userId);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>You have {unreadCount} unread notifications</h2>
      {realtimeEnabled && <span>🟢 Live</span>}
      
      <button onClick={markAllAsRead}>Mark all as read</button>
      
      <ul>
        {notifications.map(notification => (
          <li key={notification.id}>
            <div>{notification.title}</div>
            <div>{notification.message}</div>
            {!notification.read && (
              <button onClick={() => markAsRead(notification.id)}>
                Mark as read
              </button>
            )}
            <button onClick={() => deleteNotification(notification.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================
// Example 4: Creating notifications (backend)
// ============================================

// In your API route or database trigger
import { supabase } from '@/integrations/supabase/client';

export async function createBookingNotification(
  guideUserId: string,
  bookingId: string,
  customerName: string
) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: guideUserId,
      type: 'booking_request',
      title: 'New Booking Request',
      message: `${customerName} has requested to book your service`,
      related_type: 'booking',
      related_id: bookingId,
      data: {
        customer_name: customerName,
        // Any additional data you want to store
      }
    });
  
  if (error) {
    console.error('Failed to create notification:', error);
    return null;
  }
  
  return data;
}

// ============================================
// Example 5: Database Trigger (SQL)
// ============================================

/*
CREATE OR REPLACE FUNCTION notify_booking_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify customer
  INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
  VALUES (
    NEW.customer_id,
    'booking_confirmed',
    'Booking Confirmed!',
    'Your booking has been confirmed by the guide',
    'booking',
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_confirmed
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW
  WHEN (OLD.status = 'pending' AND NEW.status = 'confirmed')
  EXECUTE FUNCTION notify_booking_confirmed();
*/

// ============================================
// Example 6: With React Router
// ============================================
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export const AppWithNotifications = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <HeaderExample /> {/* Contains NotificationBell */}
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notifications" element={<NotificationsPageExample />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          {/* Other routes */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

// ============================================
// Example 7: Different notification types
// ============================================
export async function exampleNotificationTypes() {
  const userId = 'user-123';
  
  // Booking request
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'booking_request',
    title: 'New Booking Request',
    message: 'John Doe wants to book your Alaska Fishing Trip',
    related_type: 'booking',
    related_id: 'booking-123'
  });
  
  // Booking confirmed
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'booking_confirmed',
    title: 'Booking Confirmed',
    message: 'Your Alaska Fishing Trip has been confirmed',
    related_type: 'booking',
    related_id: 'booking-123'
  });
  
  // New message
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from John Doe',
    related_type: 'message',
    related_id: 'message-123'
  });
  
  // Review received
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'review',
    title: 'New Review',
    message: 'You received a 5-star review!',
    related_type: 'guide',
    related_id: 'guide-123'
  });
  
  // Payment received
  await supabase.from('notifications').insert({
    user_id: userId,
    type: 'payment',
    title: 'Payment Received',
    message: 'You received a payment of $250.00',
    related_type: 'booking',
    related_id: 'booking-123',
    data: { amount: 250.00, currency: 'USD' }
  });
}
