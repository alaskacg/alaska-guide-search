-- Create storage bucket for guide media (photos and videos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'guide-media', 
  'guide-media', 
  true,
  52428800, -- 50MB limit for videos
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
);

-- Storage policies for guide media
CREATE POLICY "Guides can upload their own media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'guide-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Guides can update their own media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'guide-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Guides can delete their own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'guide-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view guide media"
ON storage.objects FOR SELECT
USING (bucket_id = 'guide-media');

-- Create guide_media table to track uploaded files
CREATE TABLE public.guide_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_profile_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('photo', 'video')),
  title TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_cover_image BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on guide_media
ALTER TABLE public.guide_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for guide_media
CREATE POLICY "Guides can manage their own media"
ON public.guide_media FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view guide media"
ON public.guide_media FOR SELECT
USING (true);

-- Create guide_availability table for calendar scheduling
CREATE TABLE public.guide_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_profile_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS on guide_availability
ALTER TABLE public.guide_availability ENABLE ROW LEVEL SECURITY;

-- RLS policies for guide_availability
CREATE POLICY "Guides can manage their own availability"
ON public.guide_availability FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view availability"
ON public.guide_availability FOR SELECT
USING (true);

-- Create recurring availability patterns
CREATE TABLE public.guide_recurring_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_profile_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  effective_from DATE,
  effective_until DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_recurring_time_range CHECK (end_time > start_time)
);

-- Enable RLS on recurring availability
ALTER TABLE public.guide_recurring_availability ENABLE ROW LEVEL SECURITY;

-- RLS policies for recurring availability
CREATE POLICY "Guides can manage their recurring availability"
ON public.guide_recurring_availability FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view recurring availability"
ON public.guide_recurring_availability FOR SELECT
USING (true);

-- Create blocked dates table (vacations, holidays, etc.)
CREATE TABLE public.guide_blocked_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guide_profile_id UUID NOT NULL REFERENCES public.guide_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Enable RLS on blocked dates
ALTER TABLE public.guide_blocked_dates ENABLE ROW LEVEL SECURITY;

-- RLS policies for blocked dates
CREATE POLICY "Guides can manage their blocked dates"
ON public.guide_blocked_dates FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view blocked dates"
ON public.guide_blocked_dates FOR SELECT
USING (true);

-- Add index for faster availability queries
CREATE INDEX idx_guide_availability_date ON public.guide_availability(guide_profile_id, date);
CREATE INDEX idx_guide_blocked_dates ON public.guide_blocked_dates(guide_profile_id, start_date, end_date);
CREATE INDEX idx_guide_recurring_availability ON public.guide_recurring_availability(guide_profile_id, day_of_week);

-- Create trigger for updated_at on new tables
CREATE TRIGGER update_guide_media_updated_at
  BEFORE UPDATE ON public.guide_media
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_availability_updated_at
  BEFORE UPDATE ON public.guide_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_recurring_availability_updated_at
  BEFORE UPDATE ON public.guide_recurring_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();