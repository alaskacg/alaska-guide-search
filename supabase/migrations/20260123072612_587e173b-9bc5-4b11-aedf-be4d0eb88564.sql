-- Guide Listings/Adventures table
CREATE TABLE public.guide_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_profile_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  category TEXT NOT NULL CHECK (category IN ('fishing', 'hunting', 'eco', 'flights', 'adventure')),
  duration_hours INTEGER,
  duration_days INTEGER,
  max_group_size INTEGER DEFAULT 4,
  min_group_size INTEGER DEFAULT 1,
  price_per_person DECIMAL(10,2),
  price_per_group DECIMAL(10,2),
  deposit_percentage INTEGER DEFAULT 25,
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'expert')),
  included_items TEXT[],
  not_included_items TEXT[],
  what_to_bring TEXT[],
  meeting_point TEXT,
  meeting_instructions TEXT,
  cancellation_policy TEXT,
  min_age INTEGER,
  physical_requirements TEXT,
  license_required BOOLEAN DEFAULT false,
  license_info TEXT,
  seasonal_availability TEXT[],
  featured_image_url TEXT,
  gallery_images TEXT[],
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(guide_profile_id, slug)
);

-- Guide Subscription/Membership table
CREATE TABLE public.guide_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_profile_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('beta_free', 'starter', 'professional', 'elite')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'expired')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  max_listings INTEGER DEFAULT 3,
  max_photos_per_listing INTEGER DEFAULT 10,
  max_videos_per_listing INTEGER DEFAULT 2,
  can_feature_listings BOOLEAN DEFAULT false,
  priority_support BOOLEAN DEFAULT false,
  analytics_access TEXT DEFAULT 'basic' CHECK (analytics_access IN ('basic', 'advanced', 'premium')),
  commission_rate DECIMAL(4,2) DEFAULT 12.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guide_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guide_listings
CREATE POLICY "Public can view active listings"
ON public.guide_listings
FOR SELECT
USING (is_active = true);

CREATE POLICY "Guides can manage their own listings"
ON public.guide_listings
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for guide_subscriptions
CREATE POLICY "Guides can view their own subscription"
ON public.guide_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Guides can update their own subscription"
ON public.guide_subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Add beta_started_at to guide_profiles for tracking 60-day trial
ALTER TABLE public.guide_profiles 
ADD COLUMN beta_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN subscription_status TEXT DEFAULT 'beta_free';

-- Trigger for updated_at
CREATE TRIGGER update_guide_listings_updated_at
BEFORE UPDATE ON public.guide_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_subscriptions_updated_at
BEFORE UPDATE ON public.guide_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for listings
ALTER PUBLICATION supabase_realtime ADD TABLE public.guide_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.guide_availability;