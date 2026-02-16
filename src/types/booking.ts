// Enums

export enum UserType {
  CLIENT = 'client',
  GUIDE = 'guide',
  ADMIN = 'admin',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
  REFUNDED = 'refunded',
}

export enum PaymentType {
  FULL = 'full',
  DEPOSIT = 'deposit',
  INSTALLMENT = 'installment',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum ServiceType {
  HUNTING = 'hunting',
  FISHING = 'fishing',
  WILDLIFE_VIEWING = 'wildlife_viewing',
  HIKING = 'hiking',
  PHOTOGRAPHY = 'photography',
  CAMPING = 'camping',
  KAYAKING = 'kayaking',
  RAFTING = 'rafting',
  GLACIER_TOURS = 'glacier_tours',
  CUSTOM = 'custom',
}

export enum CancellationPolicyType {
  FLEXIBLE = 'flexible',
  MODERATE = 'moderate',
  STRICT = 'strict',
  SUPER_STRICT = 'super_strict',
  NON_REFUNDABLE = 'non_refundable',
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  AVATAR = 'avatar',
}

export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

// Core Interfaces

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  user_type: UserType;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  phone_verified: boolean;
  bio?: string;
  location?: string;
  timezone?: string;
  preferences?: Record<string, any>;
}

export interface Guide {
  id: string;
  user_id: string;
  profile_id: string;
  business_name: string;
  license_number?: string;
  insurance_info?: string;
  verification_status: VerificationStatus;
  rating: number;
  total_reviews: number;
  total_bookings: number;
  years_experience: number;
  certifications: string[];
  languages: string[];
  specialties: ServiceType[];
  service_area: {
    region: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    radius_miles?: number;
  };
  cancellation_policy: CancellationPolicyType;
  cancellation_policy_details?: string;
  booking_advance_notice_hours: number;
  max_group_size: number;
  minimum_age?: number;
  equipment_provided: string[];
  equipment_required: string[];
  safety_protocols: string[];
  accessibility_info?: string;
  response_time_hours?: number;
  instant_booking_enabled: boolean;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuideService {
  id: string;
  guide_id: string;
  service_type: ServiceType;
  title: string;
  description: string;
  short_description: string;
  duration_hours: number;
  price_per_person: number;
  deposit_amount?: number;
  deposit_percentage?: number;
  max_participants: number;
  min_participants: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  physical_requirements?: string;
  included: string[];
  excluded: string[];
  itinerary?: Array<{
    time: string;
    activity: string;
    description?: string;
  }>;
  meeting_point?: string;
  meeting_instructions?: string;
  what_to_bring: string[];
  seasonal_availability?: {
    start_month: number;
    end_month: number;
  };
  weather_dependent: boolean;
  tags: string[];
  images: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  guide_id: string;
  service_id?: string;
  date: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  booked_slots: number;
  blocked: boolean;
  blocked_reason?: string;
  price_override?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  client_id: string;
  guide_id: string;
  service_id: string;
  status: BookingStatus;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time?: string;
  participants: number;
  total_price: number;
  deposit_amount?: number;
  amount_paid: number;
  amount_due: number;
  payment_type: PaymentType;
  client_details: {
    name: string;
    email: string;
    phone: string;
    emergency_contact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  participant_details?: Array<{
    name: string;
    age?: number;
    experience_level?: string;
    medical_notes?: string;
  }>;
  special_requests?: string;
  pickup_location?: string;
  dropoff_location?: string;
  cancellation_requested_at?: string;
  cancellation_reason?: string;
  cancelled_by?: string;
  cancellation_fee?: number;
  refund_amount?: number;
  refund_issued_at?: string;
  completed_at?: string;
  confirmed_at?: string;
  guide_notes?: string;
  client_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingPayment {
  id: string;
  booking_id: string;
  amount: number;
  payment_status: PaymentStatus;
  payment_method: string;
  transaction_id?: string;
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  processor: 'stripe' | 'paypal' | 'square' | 'other';
  processor_fee: number;
  platform_fee: number;
  guide_payout: number;
  paid_at?: string;
  refunded_at?: string;
  refund_amount?: number;
  refund_reason?: string;
  payout_id?: string;
  payout_status?: 'pending' | 'processing' | 'paid' | 'failed';
  payout_date?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  guide_id: string;
  client_id: string;
  rating: number;
  title?: string;
  comment?: string;
  response?: string;
  response_date?: string;
  ratings_breakdown?: {
    communication?: number;
    professionalism?: number;
    value?: number;
    safety?: number;
    experience?: number;
  };
  helpful_count: number;
  verified_booking: boolean;
  flagged: boolean;
  flag_reason?: string;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaUpload {
  id: string;
  uploaded_by: string;
  entity_type: 'guide' | 'service' | 'booking' | 'review' | 'profile';
  entity_id: string;
  media_type: MediaType;
  url: string;
  thumbnail_url?: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  duration?: number;
  caption?: string;
  alt_text?: string;
  order_index: number;
  public: boolean;
  created_at: string;
}

export interface Message {
  id: string;
  booking_id?: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  read: boolean;
  read_at?: string;
  archived_by_sender: boolean;
  archived_by_recipient: boolean;
  parent_message_id?: string;
  attachments?: Array<{
    url: string;
    file_name: string;
    file_type: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'booking' | 'payment' | 'message' | 'review' | 'system' | 'reminder';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  read_at?: string;
  action_required: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  expires_at?: string;
  created_at: string;
}

export interface Dispute {
  id: string;
  booking_id: string;
  raised_by: string;
  against: string;
  dispute_type: 'service_quality' | 'cancellation' | 'refund' | 'safety' | 'other';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  description: string;
  evidence?: Array<{
    type: 'text' | 'image' | 'document';
    content: string;
    uploaded_at: string;
  }>;
  resolution?: string;
  resolved_by?: string;
  resolved_at?: string;
  refund_issued?: number;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformAnalytics {
  id: string;
  date: string;
  total_bookings: number;
  total_revenue: number;
  platform_fees: number;
  guide_payouts: number;
  new_users: number;
  new_guides: number;
  active_users: number;
  active_guides: number;
  average_booking_value: number;
  conversion_rate: number;
  cancellation_rate: number;
  dispute_rate: number;
  average_rating: number;
  popular_services: Array<{
    service_type: ServiceType;
    bookings: number;
    revenue: number;
  }>;
  top_guides: Array<{
    guide_id: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  geographic_data?: Record<string, any>;
  created_at: string;
}

export interface PlatformConfig {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: 'payment' | 'booking' | 'notification' | 'feature' | 'system';
  editable: boolean;
  last_modified_by?: string;
  updated_at: string;
}

// Utility Types

export interface BookingFormData {
  service_id: string;
  guide_id: string;
  start_date: string;
  start_time: string;
  participants: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  emergency_contact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  participant_details?: Array<{
    name: string;
    age?: number;
    experience_level?: string;
    medical_notes?: string;
  }>;
  special_requests?: string;
  pickup_location?: string;
  payment_type: PaymentType;
  agreed_to_terms: boolean;
  agreed_to_cancellation_policy: boolean;
}

export interface PaymentDetails {
  booking_id: string;
  amount: number;
  payment_method: string;
  save_payment_method?: boolean;
  billing_details: {
    name: string;
    email: string;
    phone?: string;
    address?: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  metadata?: Record<string, any>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: {
    booking_id?: string;
    service_id?: string;
    status?: BookingStatus;
    client_name?: string;
    participants?: number;
  };
  color?: string;
  allDay?: boolean;
  editable?: boolean;
}

export interface GuideFilters {
  service_types?: ServiceType[];
  location?: string;
  radius_miles?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  min_rating?: number;
  max_price?: number;
  min_price?: number;
  date_range?: {
    start: string;
    end: string;
  };
  participants?: number;
  difficulty_level?: Array<'beginner' | 'intermediate' | 'advanced' | 'expert'>;
  instant_booking_only?: boolean;
  verified_only?: boolean;
  featured_only?: boolean;
  languages?: string[];
  min_experience_years?: number;
  equipment_provided?: string[];
  certifications?: string[];
  sort_by?: 'rating' | 'price_low' | 'price_high' | 'experience' | 'reviews' | 'distance';
  page?: number;
  per_page?: number;
}

// API Response Types

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// Extended Types

export interface GuideWithServices extends Guide {
  services: GuideService[];
  profile: Profile;
  availability?: Availability[];
}

export interface BookingWithDetails extends Booking {
  guide: Guide;
  service: GuideService;
  client: Profile;
  payments: BookingPayment[];
  review?: Review;
}

export interface ReviewWithDetails extends Review {
  client: Profile;
  guide: Guide;
  service: GuideService;
}
