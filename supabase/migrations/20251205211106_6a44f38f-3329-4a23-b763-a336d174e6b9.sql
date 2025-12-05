
-- Create enum for guide application status
CREATE TYPE public.guide_application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Create enum for guide service types
CREATE TYPE public.guide_service_type AS ENUM ('adventure', 'eco', 'hunting', 'fishing', 'pilot');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guide applications table
CREATE TABLE public.guide_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Personal Information
  full_legal_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  phone_number TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  
  -- Business Information
  business_name TEXT,
  business_license_number TEXT,
  years_of_experience INTEGER NOT NULL,
  service_types guide_service_type[] NOT NULL,
  service_areas TEXT[] NOT NULL,
  
  -- Verification Documents
  government_id_url TEXT,
  guide_license_url TEXT,
  insurance_certificate_url TEXT,
  cpr_first_aid_cert_url TEXT,
  
  -- Additional Info
  bio TEXT,
  website_url TEXT,
  social_media_links JSONB,
  references_info JSONB,
  
  -- Status
  status guide_application_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guide profiles table (for approved guides)
CREATE TABLE public.guide_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  application_id UUID REFERENCES public.guide_applications(id) NOT NULL,
  
  -- Display Info
  display_name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  
  -- Service Info
  service_types guide_service_type[] NOT NULL,
  service_areas TEXT[] NOT NULL,
  years_of_experience INTEGER NOT NULL,
  
  -- Verification badges
  is_verified BOOLEAN DEFAULT true,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Business details
  business_name TEXT,
  website_url TEXT,
  
  -- Stats
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guide applications policies
CREATE POLICY "Users can view their own applications" ON public.guide_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" ON public.guide_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their pending applications" ON public.guide_applications
  FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Guide profiles policies (public read for approved guides)
CREATE POLICY "Anyone can view active guide profiles" ON public.guide_profiles
  FOR SELECT USING (is_active = true);

CREATE POLICY "Guides can update their own profile" ON public.guide_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_applications_updated_at
  BEFORE UPDATE ON public.guide_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guide_profiles_updated_at
  BEFORE UPDATE ON public.guide_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
