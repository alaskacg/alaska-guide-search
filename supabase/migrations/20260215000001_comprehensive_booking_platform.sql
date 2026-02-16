-- Comprehensive Booking Platform Schema
-- Production-ready schema for Alaska Guide Search

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User types
CREATE TYPE user_type AS ENUM ('customer', 'guide', 'admin');

-- Booking statuses
CREATE TYPE booking_status AS ENUM (
  'pending',
  'deposit_paid',
  'confirmed',
  'checked_in',
  'completed',
  'cancelled_by_customer',
  'cancelled_by_guide',
  'refunded',
  'disputed'
);

-- Payment types
CREATE TYPE payment_type AS ENUM ('deposit', 'remainder', 'refund', 'platform_fee');

-- Payment statuses
CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'succeeded',
  'failed',
  'cancelled',
  'refunded'
);

-- Service types
CREATE TYPE service_type AS ENUM (
  'fishing',
  'hunting',
  'wildlife_tour',
  'glacier_tour',
  'flightseeing',
  'photography',
  'kayaking',
  'hiking',
  'camping',
  'custom'
);

-- Cancellation policy types
CREATE TYPE cancellation_policy_type AS ENUM (
  'flexible',    -- Full refund 7+ days before
  'moderate',    -- Full refund 14+ days before
  'strict',      -- Full refund 30+ days before
  'non_refundable'
);

-- Media types
CREATE TYPE media_type AS ENUM ('photo', 'video');

-- Verification statuses
CREATE TYPE verification_status AS ENUM (
  'not_started',
  'pending',
  'in_review',
  'verified',
  'rejected',
  'expired'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Guides table
CREATE TABLE IF NOT EXISTS guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  bio TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  years_experience INTEGER NOT NULL DEFAULT 0,
  license_number TEXT,
  insurance_verified BOOLEAN NOT NULL DEFAULT false,
  insurance_expiry_date DATE,
  background_check_verified BOOLEAN NOT NULL DEFAULT false,
  background_check_date DATE,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  completed_bookings INTEGER NOT NULL DEFAULT 0,
  stripe_connect_account_id TEXT UNIQUE,
  stripe_onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  stripe_payouts_enabled BOOLEAN NOT NULL DEFAULT false,
  custom_url_slug TEXT UNIQUE,
  verification_status verification_status NOT NULL DEFAULT 'not_started',
  verification_notes TEXT,
  verified_at TIMESTAMPTZ,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_accepting_bookings BOOLEAN NOT NULL DEFAULT true,
  response_time_hours INTEGER,
  acceptance_rate DECIMAL(5, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT valid_experience CHECK (years_experience >= 0),
  CONSTRAINT valid_slug CHECK (custom_url_slug ~ '^[a-z0-9-]+$')
);

-- Guide services
CREATE TABLE IF NOT EXISTS guide_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type service_type NOT NULL,
  duration_hours DECIMAL(5, 2) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 1,
  min_guests INTEGER NOT NULL DEFAULT 1,
  included_items TEXT[] DEFAULT '{}',
  required_items TEXT[] DEFAULT '{}',
  cancellation_policy cancellation_policy_type NOT NULL DEFAULT 'moderate',
  cancellation_details TEXT,
  photos TEXT[] DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured_order INTEGER,
  booking_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_duration CHECK (duration_hours > 0),
  CONSTRAINT valid_price CHECK (base_price > 0),
  CONSTRAINT valid_guests CHECK (max_guests >= min_guests AND min_guests > 0)
);

-- Availability calendar
CREATE TABLE IF NOT EXISTS availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  service_id UUID REFERENCES guide_services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  slots_available INTEGER NOT NULL DEFAULT 1,
  booked_slots INTEGER NOT NULL DEFAULT 0,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  block_reason TEXT,
  price_override DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_slots CHECK (slots_available >= 0 AND booked_slots >= 0 AND booked_slots <= slots_available),
  CONSTRAINT unique_guide_service_date UNIQUE (guide_id, service_id, date)
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  guide_id UUID NOT NULL REFERENCES guides(id),
  service_id UUID NOT NULL REFERENCES guide_services(id),
  booking_date DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  remainder_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  guide_payout DECIMAL(10, 2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  cancellation_policy cancellation_policy_type NOT NULL,
  cancellation_deadline TIMESTAMPTZ,
  
  -- Payment tracking
  deposit_paid_at TIMESTAMPTZ,
  remainder_paid_at TIMESTAMPTZ,
  funds_released_at TIMESTAMPTZ,
  
  -- Check-in system
  check_in_code TEXT UNIQUE,
  checked_in_at TIMESTAMPTZ,
  checked_in_by UUID REFERENCES profiles(id),
  
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES profiles(id),
  cancellation_reason TEXT,
  refund_amount DECIMAL(10, 2),
  refunded_at TIMESTAMPTZ,
  
  -- Communication
  customer_notes TEXT,
  guide_notes TEXT,
  admin_notes TEXT,
  special_requests TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_guests CHECK (guests > 0),
  CONSTRAINT valid_amounts CHECK (
    total_price > 0 AND 
    deposit_amount > 0 AND 
    remainder_amount >= 0 AND
    deposit_amount + remainder_amount = total_price
  )
);

-- Booking payments
CREATE TABLE IF NOT EXISTS booking_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  type payment_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_method_last4 TEXT,
  payment_method_brand TEXT,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_amount CHECK (amount >= 0)
);

-- Reviews and ratings
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  guide_id UUID NOT NULL REFERENCES guides(id),
  service_id UUID NOT NULL REFERENCES guide_services(id),
  rating INTEGER NOT NULL,
  title TEXT,
  comment TEXT,
  photos TEXT[] DEFAULT '{}',
  response_from_guide TEXT,
  responded_at TIMESTAMPTZ,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT true, -- Verified if booking completed
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Media uploads
CREATE TABLE IF NOT EXISTS media_uploads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  type media_type NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  alt_text TEXT,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  service_id UUID REFERENCES guide_services(id) ON DELETE SET NULL,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  duration_seconds INTEGER, -- For videos
  is_featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT valid_dimensions CHECK (
    (width IS NULL AND height IS NULL) OR (width > 0 AND height > 0)
  )
);

-- Messages (customer <-> guide communication)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT different_sender_receiver CHECK (sender_id != receiver_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  raised_by UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open', -- open, in_review, resolved, closed
  resolution TEXT,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Platform analytics
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(12, 2) NOT NULL DEFAULT 0,
  platform_fees DECIMAL(12, 2) NOT NULL DEFAULT 0,
  new_guides INTEGER NOT NULL DEFAULT 0,
  new_customers INTEGER NOT NULL DEFAULT 0,
  active_guides INTEGER NOT NULL DEFAULT 0,
  completion_rate DECIMAL(5, 2),
  avg_booking_value DECIMAL(10, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Guides
CREATE INDEX idx_guides_profile_id ON guides(profile_id);
CREATE INDEX idx_guides_custom_url_slug ON guides(custom_url_slug);
CREATE INDEX idx_guides_rating ON guides(rating DESC);
CREATE INDEX idx_guides_verification_status ON guides(verification_status);
CREATE INDEX idx_guides_is_accepting_bookings ON guides(is_accepting_bookings);
CREATE INDEX idx_guides_specialties ON guides USING gin(specialties);

-- Guide Services
CREATE INDEX idx_guide_services_guide_id ON guide_services(guide_id);
CREATE INDEX idx_guide_services_type ON guide_services(type);
CREATE INDEX idx_guide_services_is_active ON guide_services(is_active);
CREATE INDEX idx_guide_services_price ON guide_services(base_price);

-- Availability
CREATE INDEX idx_availability_guide_service_date ON availability(guide_id, service_id, date);
CREATE INDEX idx_availability_date ON availability(date);
CREATE INDEX idx_availability_guide_id ON availability(guide_id);

-- Bookings
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_guide_id ON bookings(guide_id);
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);
CREATE INDEX idx_bookings_check_in_code ON bookings(check_in_code);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Payments
CREATE INDEX idx_booking_payments_booking_id ON booking_payments(booking_id);
CREATE INDEX idx_booking_payments_status ON booking_payments(status);
CREATE INDEX idx_booking_payments_type ON booking_payments(type);

-- Reviews
CREATE INDEX idx_reviews_guide_id ON reviews(guide_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Media
CREATE INDEX idx_media_uploads_guide_id ON media_uploads(guide_id);
CREATE INDEX idx_media_uploads_type ON media_uploads(type);
CREATE INDEX idx_media_uploads_booking_id ON media_uploads(booking_id);

-- Messages
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Guides policies
CREATE POLICY "Guides are viewable by everyone" ON guides
  FOR SELECT USING (true);

CREATE POLICY "Users can create their guide profile" ON guides
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'guide')
  );

CREATE POLICY "Guides can update own profile" ON guides
  FOR UPDATE USING (
    profile_id = auth.uid()
  );

-- Guide services policies
CREATE POLICY "Services are viewable by everyone" ON guide_services
  FOR SELECT USING (is_active = true OR guide_id IN (
    SELECT id FROM guides WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Guides can manage own services" ON guide_services
  FOR ALL USING (
    guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
  );

-- Availability policies
CREATE POLICY "Availability is viewable by everyone" ON availability
  FOR SELECT USING (true);

CREATE POLICY "Guides can manage own availability" ON availability
  FOR ALL USING (
    guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (
    customer_id = auth.uid() OR 
    guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
  );

CREATE POLICY "Customers can create bookings" ON bookings
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (
    customer_id = auth.uid() OR 
    guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
  );

-- Payments policies
CREATE POLICY "Users can view their booking payments" ON booking_payments
  FOR SELECT USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = auth.uid() OR 
            guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
    )
  );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews for their bookings" ON reviews
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Review authors and guides can update reviews" ON reviews
  FOR UPDATE USING (
    customer_id = auth.uid() OR 
    guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
  );

-- Media policies
CREATE POLICY "Media is viewable by everyone" ON media_uploads
  FOR SELECT USING (true);

CREATE POLICY "Guides can manage own media" ON media_uploads
  FOR ALL USING (
    guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
  );

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their sent messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Disputes policies
CREATE POLICY "Users can view disputes they're involved in" ON disputes
  FOR SELECT USING (
    raised_by = auth.uid() OR
    booking_id IN (
      SELECT id FROM bookings 
      WHERE customer_id = auth.uid() OR 
            guide_id IN (SELECT id FROM guides WHERE profile_id = auth.uid())
    )
  );

CREATE POLICY "Users can create disputes for their bookings" ON disputes
  FOR INSERT WITH CHECK (raised_by = auth.uid());

-- Platform analytics (admin only - will add admin role later)
CREATE POLICY "Analytics viewable by admins" ON platform_analytics
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_type = 'admin')
  );

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guide_services_updated_at BEFORE UPDATE ON guide_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_payments_updated_at BEFORE UPDATE ON booking_payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate unique booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'BK-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
END;
$$ LANGUAGE plpgsql;

-- Generate check-in code
CREATE OR REPLACE FUNCTION generate_check_in_code()
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate booking number and check-in code
CREATE OR REPLACE FUNCTION set_booking_codes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_number IS NULL THEN
    NEW.booking_number := generate_booking_number();
  END IF;
  
  IF NEW.check_in_code IS NULL THEN
    NEW.check_in_code := generate_check_in_code();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_codes_trigger BEFORE INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_codes();

-- Update guide rating when review is added/updated
CREATE OR REPLACE FUNCTION update_guide_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE guides
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM reviews
    WHERE guide_id = NEW.guide_id
  )
  WHERE id = NEW.guide_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_guide_rating_trigger 
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_guide_rating();

-- Update booking count when booking status changes to completed
CREATE OR REPLACE FUNCTION update_booking_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE guides
    SET 
      total_bookings = total_bookings + 1,
      completed_bookings = completed_bookings + 1
    WHERE id = NEW.guide_id;
    
    UPDATE guide_services
    SET booking_count = booking_count + 1
    WHERE id = NEW.service_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_counts_trigger 
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_booking_counts();

-- Create notification on new message
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, booking_id)
  VALUES (
    NEW.receiver_id,
    'new_message',
    'New Message',
    'You have a new message about your booking',
    NEW.booking_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_message_notification_trigger 
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION create_message_notification();

-- ============================================================================
-- STORAGE BUCKETS (to be created in Supabase dashboard or via API)
-- ============================================================================

-- Buckets needed:
-- 1. guide-media (public) - photos and videos
-- 2. guide-documents (private) - licenses, insurance, etc.
-- 3. booking-media (public) - customer photos from trips
-- 4. review-media (public) - review photos

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert platform fee configuration (can be modified via admin panel)
CREATE TABLE IF NOT EXISTS platform_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO platform_config (key, value, description) VALUES
  ('platform_fee_percentage', '5'::jsonb, 'Platform fee percentage (5%)'),
  ('deposit_percentage', '25'::jsonb, 'Required deposit percentage (25%)'),
  ('min_cancellation_hours', '24'::jsonb, 'Minimum hours before booking for cancellation'),
  ('email_notifications_enabled', 'true'::jsonb, 'Enable email notifications'),
  ('sms_notifications_enabled', 'false'::jsonb, 'Enable SMS notifications')
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profiles extending auth.users';
COMMENT ON TABLE guides IS 'Guide business profiles with verification status';
COMMENT ON TABLE guide_services IS 'Services offered by guides';
COMMENT ON TABLE availability IS 'Calendar availability for guide services';
COMMENT ON TABLE bookings IS 'Customer bookings with payment tracking';
COMMENT ON TABLE booking_payments IS 'Payment records linked to Stripe';
COMMENT ON TABLE reviews IS 'Customer reviews and ratings';
COMMENT ON TABLE media_uploads IS 'Photos and videos uploaded by guides';
COMMENT ON TABLE messages IS 'Customer-guide communication';
COMMENT ON TABLE notifications IS 'User notifications';
COMMENT ON TABLE disputes IS 'Booking disputes and resolutions';
COMMENT ON TABLE platform_analytics IS 'Daily platform metrics';
COMMENT ON TABLE platform_config IS 'Platform configuration settings';
