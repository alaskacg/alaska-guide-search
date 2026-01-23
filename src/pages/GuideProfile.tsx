import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { 
  MapPin, Star, Calendar, Clock, Users, CheckCircle2, Shield, 
  ChevronLeft, ChevronRight, Play, Image as ImageIcon, Award,
  Phone, Mail, Globe, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuroraBackground, ParticleField, NoiseTexture, MountainSilhouette } from "@/components/backgrounds";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from "date-fns";

interface GuideProfileData {
  id: string;
  display_name: string;
  business_name: string | null;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  years_of_experience: number;
  service_types: string[];
  service_areas: string[];
  website_url: string | null;
  is_verified: boolean;
  average_rating: number | null;
  total_reviews: number | null;
  total_bookings: number | null;
}

interface GuideListing {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  category: string;
  duration_hours: number | null;
  duration_days: number | null;
  price_per_person: number | null;
  price_per_group: number | null;
  max_group_size: number | null;
  difficulty_level: string | null;
  featured_image_url: string | null;
  is_active: boolean;
}

interface GuideMedia {
  id: string;
  file_path: string;
  file_type: string;
  title: string | null;
  is_cover_image: boolean;
}

interface AvailabilitySlot {
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const categoryLabels: Record<string, string> = {
  fishing: "Fishing Guide",
  hunting: "Hunting Guide",
  eco: "Eco-Tours",
  flights: "Bush Pilot",
  adventure: "Adventure Guide",
  pilot: "Bush Pilot",
};

export default function GuideProfile() {
  const { guideId } = useParams();
  const [profile, setProfile] = useState<GuideProfileData | null>(null);
  const [listings, setListings] = useState<GuideListing[]>([]);
  const [media, setMedia] = useState<GuideMedia[]>([]);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState<number>(0);

  useEffect(() => {
    fetchGuideData();
  }, [guideId]);

  // Real-time availability subscription
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('guide-availability')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'guide_availability',
          filter: `guide_profile_id=eq.${profile.id}`,
        },
        () => fetchAvailability(profile.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  const fetchGuideData = async () => {
    if (!guideId) return;
    setLoading(true);

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("guide_profiles")
        .select("*")
        .eq("id", guideId)
        .eq("is_active", true)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Fetch listings, media, and availability in parallel
      const [listingsRes, mediaRes] = await Promise.all([
        supabase
          .from("guide_listings")
          .select("*")
          .eq("guide_profile_id", guideId)
          .eq("is_active", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("guide_media")
          .select("*")
          .eq("guide_profile_id", guideId)
          .order("display_order", { ascending: true }),
      ]);

      setListings((listingsRes.data as GuideListing[]) || []);
      setMedia((mediaRes.data as GuideMedia[]) || []);

      // Fetch availability
      await fetchAvailability(guideId);
    } catch (error) {
      console.error("Error fetching guide data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async (profileId: string) => {
    const startDate = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(addMonths(currentMonth, 2)), 'yyyy-MM-dd');

    const { data } = await supabase
      .from("guide_availability")
      .select("date, start_time, end_time, is_available")
      .eq("guide_profile_id", profileId)
      .gte("date", startDate)
      .lte("date", endDate);

    setAvailability((data as AvailabilitySlot[]) || []);
  };

  const getStorageUrl = (path: string) => {
    const { data } = supabase.storage.from("guide-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const getDayAvailability = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return availability.find(a => a.date === dateStr);
  };

  const photos = media.filter(m => m.file_type.startsWith('image/'));
  const videos = media.filter(m => m.file_type.startsWith('video/'));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading guide profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="font-display text-2xl text-foreground">Guide Not Found</h1>
          <Link to="/" className="text-accent hover:underline mt-4 inline-block">Return Home</Link>
        </div>
      </div>
    );
  }

  const coverImage = profile.cover_image_url 
    || photos.find(p => p.is_cover_image)?.file_path
    || photos[0]?.file_path;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Cover Image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {coverImage ? (
          <img 
            src={coverImage.startsWith('http') ? coverImage : getStorageUrl(coverImage)} 
            alt={profile.display_name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0">
            <AuroraBackground />
            <MountainSilhouette />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <NoiseTexture />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto flex items-end gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="shrink-0"
            >
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-background shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-cta flex items-center justify-center border-4 border-background shadow-xl">
                  <span className="text-4xl font-display text-accent-foreground">
                    {profile.display_name.charAt(0)}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Name & Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 min-w-0"
            >
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="font-display text-3xl md:text-4xl text-foreground">
                  {profile.display_name}
                </h1>
                {profile.is_verified && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </Badge>
                )}
              </div>
              
              {profile.tagline && (
                <p className="text-lg text-muted-foreground mb-3">{profile.tagline}</p>
              )}

              <div className="flex items-center gap-4 flex-wrap text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {profile.service_areas.slice(0, 2).join(", ")}
                  {profile.service_areas.length > 2 && ` +${profile.service_areas.length - 2}`}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  {profile.years_of_experience} years experience
                </span>
                {profile.average_rating && (
                  <span className="flex items-center gap-1.5 text-accent">
                    <Star className="h-4 w-4 fill-current" />
                    {profile.average_rating.toFixed(1)} ({profile.total_reviews} reviews)
                  </span>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex gap-3"
            >
              <Button variant="hero" size="lg">
                Book Now
              </Button>
              <Button variant="outline" size="lg">
                Contact
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Types */}
            <div className="flex flex-wrap gap-2">
              {profile.service_types.map(type => (
                <Badge key={type} variant="secondary" className="text-sm py-1.5 px-3">
                  {categoryLabels[type] || type}
                </Badge>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full justify-start bg-muted/30 p-1">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="adventures">Adventures ({listings.length})</TabsTrigger>
                <TabsTrigger value="gallery">Gallery ({photos.length})</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-6">
                {/* Bio */}
                {profile.bio && (
                  <div className="glass rounded-xl p-6">
                    <h2 className="font-display text-xl text-foreground mb-4">About {profile.display_name}</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                  </div>
                )}

                {/* Alaska Safety Note */}
                <div className="glass rounded-xl p-6 border-l-4 border-amber-500/50">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-amber-400 shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Why Book a Local Expert?</h3>
                      <p className="text-sm text-muted-foreground">
                        Alaska's wilderness demands respect. From unpredictable weather to wildlife encounters, 
                        having an experienced local guide isn't just about convenience—it's about safety. 
                        {profile.display_name} brings {profile.years_of_experience} years of Alaska experience 
                        to ensure your adventure is both thrilling and safe.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                <div className="glass rounded-xl p-6">
                  <h2 className="font-display text-xl text-foreground mb-4">Service Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.service_areas.map(area => (
                      <Badge key={area} variant="outline" className="py-1.5 px-3">
                        <MapPin className="h-3.5 w-3.5 mr-1.5" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adventures" className="mt-6">
                {listings.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <p className="text-muted-foreground">No adventures listed yet. Check back soon!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {listings.map(listing => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-xl overflow-hidden group hover:shadow-glow transition-shadow cursor-pointer"
                      >
                        <div className="h-48 bg-gradient-to-br from-muted to-muted/50 relative">
                          {listing.featured_image_url ? (
                            <img 
                              src={listing.featured_image_url} 
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur">
                            {categoryLabels[listing.category] || listing.category}
                          </Badge>
                        </div>
                        <div className="p-5 space-y-3">
                          <h3 className="font-display text-lg text-foreground group-hover:text-accent transition-colors">
                            {listing.title}
                          </h3>
                          {listing.short_description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {listing.short_description}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              {listing.duration_hours && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {listing.duration_hours}h
                                </span>
                              )}
                              {listing.max_group_size && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  Up to {listing.max_group_size}
                                </span>
                              )}
                            </div>
                            {listing.price_per_person && (
                              <span className="font-semibold text-accent">
                                ${listing.price_per_person}<span className="text-xs text-muted-foreground">/person</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="gallery" className="mt-6">
                {photos.length === 0 && videos.length === 0 ? (
                  <div className="glass rounded-xl p-12 text-center">
                    <p className="text-muted-foreground">No photos or videos yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Main Image */}
                    {photos.length > 0 && (
                      <div className="relative aspect-video rounded-xl overflow-hidden">
                        <img
                          src={getStorageUrl(photos[selectedImage]?.file_path)}
                          alt={photos[selectedImage]?.title || "Gallery image"}
                          className="w-full h-full object-cover"
                        />
                        {photos.length > 1 && (
                          <>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                              onClick={() => setSelectedImage(i => i === 0 ? photos.length - 1 : i - 1)}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                              onClick={() => setSelectedImage(i => i === photos.length - 1 ? 0 : i + 1)}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}

                    {/* Thumbnails */}
                    <div className="grid grid-cols-6 gap-3">
                      {photos.map((photo, i) => (
                        <button
                          key={photo.id}
                          onClick={() => setSelectedImage(i)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            i === selectedImage ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={getStorageUrl(photo.file_path)}
                            alt={photo.title || "Thumbnail"}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      {videos.map(video => (
                        <button
                          key={video.id}
                          className="aspect-square rounded-lg overflow-hidden border-2 border-transparent opacity-70 hover:opacity-100 relative"
                        >
                          <video
                            src={getStorageUrl(video.file_path)}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="glass rounded-xl p-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-lg text-foreground mb-2">Reviews Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Be one of the first to book with {profile.display_name} and leave a review!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Booking & Availability */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6 sticky top-24"
            >
              <h2 className="font-display text-xl text-foreground mb-4">Book an Adventure</h2>
              
              {listings.length > 0 && listings[0].price_per_person && (
                <div className="mb-4">
                  <span className="text-2xl font-bold text-foreground">
                    From ${listings[0].price_per_person}
                  </span>
                  <span className="text-muted-foreground"> / person</span>
                </div>
              )}

              <Button variant="hero" className="w-full mb-4">
                Check Availability
              </Button>

              {/* Mini Calendar */}
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-foreground text-sm">Availability</h3>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setCurrentMonth(m => addMonths(m, -1))}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground w-20 text-center">
                      {format(currentMonth, 'MMM yyyy')}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-muted-foreground py-1">{d}</div>
                  ))}
                  {eachDayOfInterval({
                    start: startOfMonth(currentMonth),
                    end: endOfMonth(currentMonth)
                  }).map((date, i) => {
                    const dayAvailability = getDayAvailability(date);
                    const isPast = isBefore(date, new Date()) && !isToday(date);
                    const isAvailable = dayAvailability?.is_available && !isPast;

                    return (
                      <button
                        key={i}
                        disabled={isPast || !isAvailable}
                        className={`
                          aspect-square rounded flex items-center justify-center text-xs
                          ${isPast ? 'text-muted-foreground/30' : ''}
                          ${isAvailable ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : ''}
                          ${isToday(date) ? 'ring-1 ring-accent' : ''}
                          ${!isPast && !isAvailable ? 'text-muted-foreground' : ''}
                        `}
                      >
                        {format(date, 'd')}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-500/30" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-muted" /> Unavailable
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <h3 className="font-medium text-foreground text-sm">Contact</h3>
                {profile.website_url && (
                  <a 
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Visit Website
                  </a>
                )}
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" /> Send Message
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span>Secure booking · Low deposit · Free cancellation</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}