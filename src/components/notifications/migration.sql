-- Migration: Create notifications table
-- Description: Sets up the notifications system with real-time capabilities

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'booking_request',
    'booking_confirmed',
    'booking_cancelled',
    'message',
    'review',
    'payment'
  )),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  data JSONB DEFAULT '{}'::jsonb,
  related_id UUID,
  related_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
  ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read 
  ON notifications(user_id, read);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
  ON notifications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_type 
  ON notifications(type);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Allow system/authenticated users to create notifications
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Optional: Add trigger to clean up old notifications (older than 90 days)
CREATE OR REPLACE FUNCTION delete_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job (requires pg_cron extension)
-- Run this separately if you want automatic cleanup:
-- SELECT cron.schedule('delete-old-notifications', '0 2 * * *', 'SELECT delete_old_notifications()');

-- Example trigger: Notify guide of new booking requests
CREATE OR REPLACE FUNCTION notify_guide_new_booking()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if booking is new (pending status)
  IF NEW.status = 'pending' THEN
    INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
    VALUES (
      NEW.guide_id,
      'booking_request',
      'New Booking Request',
      'You have a new booking request for ' || NEW.service_name,
      'booking',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Only create this trigger if you have a bookings table
-- DROP TRIGGER IF EXISTS on_booking_created ON bookings;
-- CREATE TRIGGER on_booking_created
--   AFTER INSERT ON bookings
--   FOR EACH ROW
--   EXECUTE FUNCTION notify_guide_new_booking();

-- Example trigger: Notify customer when booking is confirmed
CREATE OR REPLACE FUNCTION notify_customer_booking_confirmed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if status changed from pending to confirmed
  IF OLD.status = 'pending' AND NEW.status = 'confirmed' THEN
    INSERT INTO notifications (user_id, type, title, message, related_type, related_id)
    VALUES (
      NEW.customer_id,
      'booking_confirmed',
      'Booking Confirmed!',
      'Your booking for ' || NEW.service_name || ' has been confirmed',
      'booking',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Only create this trigger if you have a bookings table
-- DROP TRIGGER IF EXISTS on_booking_status_changed ON bookings;
-- CREATE TRIGGER on_booking_status_changed
--   AFTER UPDATE ON bookings
--   FOR EACH ROW
--   WHEN (OLD.status IS DISTINCT FROM NEW.status)
--   EXECUTE FUNCTION notify_customer_booking_confirmed();

-- Example: Function to create a notification (can be called from Edge Functions)
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_related_type TEXT DEFAULT NULL,
  p_related_id UUID DEFAULT NULL,
  p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, related_type, related_id, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_related_type, p_related_id, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON notifications TO authenticated;
GRANT EXECUTE ON FUNCTION create_notification TO authenticated;
GRANT EXECUTE ON FUNCTION delete_old_notifications TO authenticated;
