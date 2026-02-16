import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import { 
  MapPin, Star, Calendar, Clock, Users, CheckCircle2, Shield, 
  Award, Phone, Mail, Globe, MessageCircle, Share2, Heart,
  ChevronLeft, BadgeCheck, TrendingUp, Target, AlertCircle,
  DollarSign, CalendarDays, CheckCircle, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaGallery } from '@/components/media/MediaGallery';
import { VerificationBadge } from '@/components/trust/VerificationBadge';
import { TrustBadges } from '@/components/TrustBadges';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Types
interface Guide {
  id: string;
  user_id: string;
  display_name: string;
  business_name?: string;
  custom_url_slug?: string;
  tagline?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  years_of_experience: number;
  service_types: string[];
  service_areas: string[];
  website_url?: string;
  phone_number?: string;
  email?: string;
  is_verified: boolean;
  verification_status?: 'verified' | 'pending' | 'rejected' | 'not_started';
  average_rating?: number;
  total_reviews?: number;
  total_bookings?: number;
  certifications?: string[];
  languages?: string[];
  specialties?: string[];
  insurance_verified?: boolean;
  license_verified?: boolean;
  background_check_verified?: boolean;
  response_time_hours?: number;
  instant_booking_enabled?: boolean;
}

interface GuideService {
  id: string;
  guide_id: string;
  title: string;
  description: string;
  short_description?: string;
  duration_hours?: number;
  duration_days?: number;
  price_per_person?: number;
  price_per_group?: number;
  deposit_amount?: number;
  max_group_size: number;
  min_group_size?: number;
  difficulty_level?: string;
  category: string;
  featured_image_url?: string;
  included?: string[];
  excluded?: string[];
  what_to_bring?: string[];
  meeting_point?: string;
  is_active: boolean;
}

interface Review {
  id: string;
  client_name: string;
  client_avatar?: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
  verified_booking: boolean;
  ratings_breakdown?: {
    communication?: number;
    professionalism?: number;
    value?: number;
    safety?: number;
  };
}

interface AvailabilitySlot {
  date: string;
  start_time: string;
  end_time: string;
  available_slots: number;
  booked_slots: number;
  is_available: boolean;
}

export default function GuideBookingPage() {
  const { username } = useParams<{ username: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [services, setServices] = useState<GuideService[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingSticky, setShowBookingSticky] = useState(false);

  // Fetch guide data
  useEffect(() => {
    async function fetchGuideData() {
      if (!username) {
        setError('No guide username provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch guide by custom_url_slug
        const { data: guideData, error: guideError } = await supabase
          .from('guide_profiles')
          .select('*')
          .eq('custom_url_slug', username)
          .single();

        if (guideError) throw guideError;
        if (!guideData) throw new Error('Guide not found');

        setGuide(guideData as Guide);

        // Fetch guide services
        const { data: servicesData, error: servicesError } = await supabase
          .from('guide_listings')
          .select('*')
          .eq('guide_id', guideData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;
        setServices((servicesData || []) as GuideService[]);

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('guide_reviews')
          .select('*')
          .eq('guide_id', guideData.id)
          .eq('visible', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviewsError) console.error('Error fetching reviews:', reviewsError);
        setReviews((reviewsData || []) as Review[]);

        // Fetch upcoming availability (next 30 days)
        const today = new Date().toISOString().split('T')[0];
        const { data: availabilityData, error: availabilityError } = await supabase
          .from('service_availability')
          .select('*')
          .eq('guide_id', guideData.id)
          .gte('date', today)
          .order('date', { ascending: true })
          .limit(30);

        if (availabilityError) console.error('Error fetching availability:', availabilityError);
        setAvailability((availabilityData || []) as AvailabilitySlot[]);

      } catch (err: any) {
        console.error('Error fetching guide data:', err);
        setError(err.message || 'Failed to load guide profile');
      } finally {
        setLoading(false);
      }
    }

    fetchGuideData();
  }, [username]);

  // Handle scroll for sticky booking button
  useEffect(() => {
    const handleScroll = () => {
      setShowBookingSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <LoadingSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !guide) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Guide not found'}
            </AlertDescription>
          </Alert>
          <div className="mt-6">
            <Link to="/">
              <Button variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const averageRating = guide.average_rating || 0;
  const totalReviews = guide.total_reviews || 0;
  const verificationStatus = guide.verification_status || 'not_started';

  return (
    <>
      <Helmet>
        <title>{guide.display_name} - {guide.business_name || 'Alaska Guide'} | Book Your Adventure</title>
        <meta name="description" content={guide.tagline || guide.bio?.substring(0, 155) || `Book ${guide.display_name} for your next Alaska adventure`} />
        <meta property="og:title" content={`${guide.display_name} - ${guide.business_name || 'Alaska Guide'}`} />
        <meta property="og:description" content={guide.tagline || guide.bio?.substring(0, 155)} />
        <meta property="og:image" content={guide.cover_image_url || guide.avatar_url || ''} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`${window.location.origin}/guide/${username}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          {/* Cover Image */}
          {guide.cover_image_url && (
            <div className="absolute inset-0">
              <img
                src={guide.cover_image_url}
                alt={guide.display_name}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
            </div>
          )}

          {/* Hero Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end w-full">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-2xl">
                  <AvatarImage src={guide.avatar_url} alt={guide.display_name} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {guide.display_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Guide Info */}
              <motion.div
                className="flex-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl md:text-4xl font-bold text-white">
                        {guide.display_name}
                      </h1>
                      {guide.is_verified && (
                        <VerificationBadge status={verificationStatus} size="md" />
                      )}
                    </div>
                    
                    {guide.business_name && (
                      <p className="text-xl text-slate-200 mb-2">{guide.business_name}</p>
                    )}
                    
                    {guide.tagline && (
                      <p className="text-lg text-slate-300 mb-3">{guide.tagline}</p>
                    )}

                    <div className="flex flex-wrap gap-4 items-center">
                      {/* Rating */}
                      {totalReviews > 0 && (
                        <div className="flex items-center gap-2 text-white">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
                          <span className="text-slate-300">({totalReviews} reviews)</span>
                        </div>
                      )}

                      {/* Experience */}
                      <div className="flex items-center gap-2 text-slate-200">
                        <Award className="h-5 w-5" />
                        <span>{guide.years_of_experience} years experience</span>
                      </div>

                      {/* Location */}
                      {guide.service_areas.length > 0 && (
                        <div className="flex items-center gap-2 text-slate-200">
                          <MapPin className="h-5 w-5" />
                          <span>{guide.service_areas[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      onClick={() => setIsFavorite(!isFavorite)}
                    >
                      <Heart className={cn("h-5 w-5", isFavorite && "fill-red-500 text-red-500")} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                      onClick={() => navigator.share?.({ 
                        title: guide.display_name, 
                        url: window.location.href 
                      })}
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <TrustBadges
                  verified={guide.is_verified}
                  insuranceVerified={guide.insurance_verified}
                  licenseVerified={guide.license_verified}
                  backgroundCheckVerified={guide.background_check_verified}
                  responseTime={guide.response_time_hours}
                  instantBooking={guide.instant_booking_enabled}
                />
              </motion.div>

              {/* About */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      About {guide.display_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {guide.bio && (
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {guide.bio}
                      </p>
                    )}

                    {/* Specialties */}
                    {guide.service_types.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {guide.service_types.map((type) => (
                            <Badge key={type} variant="secondary">
                              {type.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {guide.languages && guide.languages.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {guide.languages.map((lang) => (
                            <Badge key={lang} variant="outline">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {guide.certifications && guide.certifications.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <BadgeCheck className="h-4 w-4" />
                          Certifications
                        </h4>
                        <ul className="space-y-1">
                          {guide.certifications.map((cert, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Services & Pricing
                    </CardTitle>
                    <CardDescription>Choose from our available adventures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {services.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No services available at this time
                      </p>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {services.map((service) => (
                          <ServiceCard
                            key={service.id}
                            service={service}
                            selected={selectedService === service.id}
                            onSelect={() => setSelectedService(service.id)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Media Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery</CardTitle>
                    <CardDescription>Photos & videos from past adventures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MediaGallery guideId={guide.id} editable={false} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      Reviews ({totalReviews})
                    </CardTitle>
                    {totalReviews > 0 && (
                      <CardDescription>
                        Average rating: {averageRating.toFixed(1)} out of 5
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {reviews.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No reviews yet. Be the first to book and review!
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <ReviewCard key={review.id} review={review} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                className="sticky top-4 space-y-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Booking Card */}
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Book Your Adventure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Starting from</span>
                        {services.length > 0 && services[0].price_per_person && (
                          <span className="text-2xl font-bold text-primary">
                            ${services[0].price_per_person}
                            <span className="text-sm font-normal text-muted-foreground">/person</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Quick Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Response time: {guide.response_time_hours || 24} hours</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{guide.total_bookings || 0} completed trips</span>
                      </div>
                      {guide.instant_booking_enabled && (
                        <div className="flex items-center gap-3 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Instant booking available</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* CTA Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full" size="lg" asChild>
                        <a href="#services">
                          <CalendarDays className="mr-2 h-5 w-5" />
                          Check Availability
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`mailto:${guide.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Message
                        </a>
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      Free cancellation up to 48 hours before trip
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {guide.phone_number && (
                      <a
                        href={`tel:${guide.phone_number}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{guide.phone_number}</span>
                      </a>
                    )}
                    {guide.email && (
                      <a
                        href={`mailto:${guide.email}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{guide.email}</span>
                      </a>
                    )}
                    {guide.website_url && (
                      <a
                        href={guide.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}
                  </CardContent>
                </Card>

                {/* Safety Info */}
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-green-900 dark:text-green-100">
                          Your Safety Matters
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-200">
                          All guides are verified, insured, and follow strict safety protocols.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Book Button (Mobile) */}
        <AnimatePresence>
          {showBookingSticky && (
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-background border-t shadow-lg"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    {services.length > 0 && services[0].price_per_person && (
                      <div className="text-lg font-bold">
                        ${services[0].price_per_person}
                        <span className="text-sm font-normal text-muted-foreground">/person</span>
                      </div>
                    )}
                    {totalReviews > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{averageRating.toFixed(1)} ({totalReviews})</span>
                      </div>
                    )}
                  </div>
                  <Button size="lg" asChild>
                    <a href="#services">
                      Book Now
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </>
  );
}

// Service Card Component
function ServiceCard({ 
  service, 
  selected, 
  onSelect 
}: { 
  service: GuideService; 
  selected: boolean; 
  onSelect: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
        selected 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary/50"
      )}
    >
      {service.featured_image_url && (
        <div className="aspect-video rounded-md overflow-hidden mb-3">
          <img
            src={service.featured_image_url}
            alt={service.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <h4 className="font-semibold mb-1">{service.title}</h4>
      
      {service.short_description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {service.short_description}
        </p>
      )}

      <div className="space-y-2">
        {/* Duration */}
        {(service.duration_hours || service.duration_days) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {service.duration_days 
                ? `${service.duration_days} days`
                : `${service.duration_hours} hours`}
            </span>
          </div>
        )}

        {/* Group Size */}
        {service.max_group_size && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Up to {service.max_group_size} people</span>
          </div>
        )}

        {/* Difficulty */}
        {service.difficulty_level && (
          <Badge variant="outline" className="capitalize">
            {service.difficulty_level}
          </Badge>
        )}

        {/* Price */}
        <div className="pt-2 border-t">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">
              ${service.price_per_person || service.price_per_group}
            </span>
            <span className="text-sm text-muted-foreground">
              /{service.price_per_person ? 'person' : 'group'}
            </span>
          </div>
          {service.deposit_amount && (
            <p className="text-xs text-muted-foreground mt-1">
              ${service.deposit_amount} deposit required
            </p>
          )}
        </div>
      </div>

      {selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="h-6 w-6 text-primary fill-primary" />
        </div>
      )}
    </motion.div>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.client_avatar} />
          <AvatarFallback>{review.client_name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{review.client_name}</p>
                {review.verified_booking && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), 'MMMM yyyy')}
              </p>
            </div>
            
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              ))}
            </div>
          </div>

          {review.title && (
            <h4 className="font-semibold">{review.title}</h4>
          )}

          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>

          {/* Ratings Breakdown */}
          {review.ratings_breakdown && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {Object.entries(review.ratings_breakdown).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground capitalize">
                    {key.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          i < (value || 0) ? "bg-yellow-400" : "bg-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Hero Skeleton */}
      <div className="flex gap-6 items-end">
        <Skeleton className="h-40 w-40 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );
}
