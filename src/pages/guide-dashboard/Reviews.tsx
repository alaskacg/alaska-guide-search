import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star,
  StarHalf,
  MessageSquare,
  CheckCircle2,
  Filter,
  TrendingUp,
  Award,
  MessageCircle,
  Sparkles,
  Calendar,
  User,
  Shield,
  Reply
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GuideProfile } from "@/hooks/useGuideProfile";
import { Review } from "@/types/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardContext {
  profile: GuideProfile | null;
}

interface ReviewWithDetails extends Review {
  client_name: string;
  client_avatar?: string;
  service_title: string;
  booking_number: string;
  featured?: boolean;
}

const StarRating = ({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };
  
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />);
  }
  
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`} />);
  }
  
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} className={`${sizeClasses[size]} text-slate-600`} />);
  }
  
  return <div className="flex gap-0.5">{stars}</div>;
};

export default function Reviews() {
  const { profile } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([
    {
      id: "1",
      booking_id: "booking1",
      guide_id: profile?.id || "",
      client_id: "client1",
      client_name: "John Smith",
      service_title: "Full Day Salmon Fishing",
      booking_number: "BK-2024-001",
      rating: 5,
      title: "Absolutely Amazing Experience!",
      comment: "This was hands down the best fishing trip I've ever been on. Our guide was incredibly knowledgeable and patient, especially with my kids who were fishing for the first time. We caught our limit of salmon and the scenery was breathtaking. Highly recommend!",
      ratings_breakdown: {
        communication: 5,
        professionalism: 5,
        value: 5,
        safety: 5,
        experience: 5,
      },
      helpful_count: 12,
      verified_booking: true,
      flagged: false,
      visible: true,
      featured: true,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      response: "Thank you so much for the kind words! It was a pleasure having you and your family. We're thrilled you had such a great time and hope to see you again soon!",
      response_date: new Date(Date.now() - 86400000 * 9).toISOString(),
    },
    {
      id: "2",
      booking_id: "booking2",
      guide_id: profile?.id || "",
      client_id: "client2",
      client_name: "Sarah Johnson",
      service_title: "Grizzly Bear Viewing Experience",
      booking_number: "BK-2024-002",
      rating: 4.5,
      title: "Great wildlife experience",
      comment: "Saw multiple bears in their natural habitat. Guide was very safety-conscious and knowledgeable about bear behavior. Only minor issue was we had to wait quite a bit, but that's nature for you. Would definitely recommend to wildlife enthusiasts.",
      ratings_breakdown: {
        communication: 5,
        professionalism: 5,
        value: 4,
        safety: 5,
        experience: 4,
      },
      helpful_count: 8,
      verified_booking: true,
      flagged: false,
      visible: true,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "3",
      booking_id: "booking3",
      guide_id: profile?.id || "",
      client_id: "client3",
      client_name: "Michael Brown",
      service_title: "Glacier Hiking Adventure",
      booking_number: "BK-2024-003",
      rating: 5,
      title: "Bucket list item checked!",
      comment: "Walking on a glacier was an unforgettable experience. Our guide made us feel safe and explained the geology in an interesting way. Equipment was top-notch and well-maintained. Pictures don't do it justice!",
      ratings_breakdown: {
        communication: 5,
        professionalism: 5,
        value: 5,
        safety: 5,
        experience: 5,
      },
      helpful_count: 15,
      verified_booking: true,
      flagged: false,
      visible: true,
      featured: true,
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 15).toISOString(),
      response: "Thank you! We're so happy you enjoyed the glacier hike. It truly is a magical experience. Hope to guide you on another adventure soon!",
      response_date: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: "4",
      booking_id: "booking4",
      guide_id: profile?.id || "",
      client_id: "client4",
      client_name: "Emily Davis",
      service_title: "Full Day Salmon Fishing",
      booking_number: "BK-2024-004",
      rating: 3.5,
      title: "Good but could be better",
      comment: "The fishing was okay, caught a few salmon. Guide was friendly but seemed a bit distracted at times. Lunch provided was great. For the price, I expected a bit more personal attention.",
      ratings_breakdown: {
        communication: 3,
        professionalism: 4,
        value: 3,
        safety: 4,
        experience: 4,
      },
      helpful_count: 3,
      verified_booking: true,
      flagged: false,
      visible: true,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterVerified, setFilterVerified] = useState<string>("all");
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithDetails | null>(null);
  const [responseText, setResponseText] = useState("");

  // Calculate statistics
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  
  const ratingDistribution = {
    5: reviews.filter(r => r.rating >= 4.5).length,
    4: reviews.filter(r => r.rating >= 3.5 && r.rating < 4.5).length,
    3: reviews.filter(r => r.rating >= 2.5 && r.rating < 3.5).length,
    2: reviews.filter(r => r.rating >= 1.5 && r.rating < 2.5).length,
    1: reviews.filter(r => r.rating < 1.5).length,
  };

  const filterReviews = (filterType: string) => {
    let filtered = reviews;

    if (filterType === "featured") {
      return filtered.filter(r => r.featured);
    }

    // Filter by rating
    if (filterRating !== "all") {
      const minRating = parseFloat(filterRating);
      filtered = filtered.filter(r => r.rating >= minRating);
    }

    // Filter by verified status
    if (filterVerified === "verified") {
      filtered = filtered.filter(r => r.verified_booking);
    } else if (filterVerified === "unverified") {
      filtered = filtered.filter(r => !r.verified_booking);
    }

    return filtered;
  };

  const handleRespondToReview = (review: ReviewWithDetails) => {
    setSelectedReview(review);
    setResponseText(review.response || "");
    setShowResponseDialog(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedReview || !responseText.trim()) return;

    try {
      setReviews(prev => prev.map(r => 
        r.id === selectedReview.id 
          ? { 
              ...r, 
              response: responseText,
              response_date: new Date().toISOString()
            }
          : r
      ));
      
      toast({
        title: "Response Posted",
        description: "Your response has been posted successfully",
      });
      
      setShowResponseDialog(false);
      setResponseText("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = (reviewId: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, featured: !r.featured } : r
    ));
    
    const review = reviews.find(r => r.id === reviewId);
    toast({
      title: review?.featured ? "Removed from Featured" : "Added to Featured",
      description: review?.featured 
        ? "Review removed from featured list" 
        : "Review is now featured on your profile",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const ReviewCard = ({ review }: { review: ReviewWithDetails }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-glacier-600 to-glacier-800 flex items-center justify-center text-white font-semibold">
                  {review.client_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{review.client_name}</span>
                    {review.verified_booking && (
                      <Shield className="w-4 h-4 text-green-400" title="Verified Booking" />
                    )}
                    {review.featured && (
                      <Sparkles className="w-4 h-4 text-yellow-400" title="Featured Review" />
                    )}
                  </div>
                  <div className="text-sm text-slate-400">
                    {review.service_title} • {formatDate(review.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="md" />
                <span className="text-sm font-semibold text-slate-300">{review.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          {review.title && (
            <CardTitle className="text-lg mt-3">{review.title}</CardTitle>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-slate-300 leading-relaxed">{review.comment}</p>

          {review.ratings_breakdown && (
            <>
              <Separator className="bg-slate-800" />
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(review.ratings_breakdown).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-xs text-slate-400 capitalize">
                      {key.replace('_', ' ')}
                    </div>
                    <div className="flex items-center gap-1">
                      <StarRating rating={value || 0} size="sm" />
                      <span className="text-xs text-slate-500">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {review.response && (
            <>
              <Separator className="bg-slate-800" />
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Reply className="w-4 h-4" />
                  <span className="font-semibold">Your Response</span>
                  <span>•</span>
                  <span>{formatDate(review.response_date!)}</span>
                </div>
                <p className="text-slate-300">{review.response}</p>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 flex-wrap">
          {!review.response && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleRespondToReview(review)}
              className="border-slate-700"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Respond
            </Button>
          )}
          {review.response && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRespondToReview(review)}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Edit Response
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => toggleFeatured(review.id)}
          >
            <Sparkles className={`w-4 h-4 mr-1 ${review.featured ? 'text-yellow-400' : ''}`} />
            {review.featured ? 'Featured' : 'Feature'}
          </Button>
          <div className="ml-auto flex items-center gap-1 text-sm text-slate-400">
            <Award className="w-4 h-4" />
            <span>{review.helpful_count} helpful</span>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <MessageSquare className="w-16 h-16 mx-auto text-slate-600 mb-4" />
      <p className="text-slate-400 text-lg">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reviews</h1>
        <p className="text-slate-400">Manage customer feedback and ratings</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <Card className="bg-gradient-to-br from-yellow-900/30 to-slate-900/50 border-yellow-800/50">
          <CardHeader>
            <CardDescription>Overall Rating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="text-6xl font-bold text-yellow-400">
                {avgRating.toFixed(1)}
              </div>
              <div className="pb-2">
                <StarRating rating={avgRating} size="lg" />
                <p className="text-sm text-slate-400 mt-1">
                  Based on {totalReviews} reviews
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardDescription>Rating Distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm text-slate-400">{stars}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                </div>
                <Progress 
                  value={(ratingDistribution[stars as keyof typeof ratingDistribution] / totalReviews) * 100} 
                  className="flex-1 h-2"
                />
                <span className="text-sm text-slate-400 w-8 text-right">
                  {ratingDistribution[stars as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating-filter" className="text-sm text-slate-400 mb-2 block">
                Minimum Rating
              </Label>
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger id="rating-filter" className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.0">3.0+ Stars</SelectItem>
                  <SelectItem value="2.0">2.0+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="verified-filter" className="text-sm text-slate-400 mb-2 block">
                Verification Status
              </Label>
              <Select value={filterVerified} onValueChange={setFilterVerified}>
                <SelectTrigger id="verified-filter" className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="All Reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reviews</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="all">
            All Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="featured">
            Featured ({reviews.filter(r => r.featured).length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Response ({reviews.filter(r => !r.response).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <Skeleton className="h-12 bg-slate-800" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-24 bg-slate-800" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterReviews("all").length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {filterReviews("all").map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <EmptyState message="No reviews yet" />
          )}
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          {filterReviews("featured").length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {filterReviews("featured").map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <EmptyState message="No featured reviews. Mark reviews as featured to showcase them on your profile!" />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {reviews.filter(r => !r.response).length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {reviews.filter(r => !r.response).map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <EmptyState message="All caught up! You've responded to all reviews." />
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedReview?.response ? 'Edit Response' : 'Respond to Review'}
            </DialogTitle>
            <DialogDescription>
              Responding to review from {selectedReview?.client_name}
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-6">
              {/* Review Preview */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={selectedReview.rating} size="md" />
                  <span className="font-semibold text-slate-300">
                    {selectedReview.rating.toFixed(1)}
                  </span>
                </div>
                {selectedReview.title && (
                  <h4 className="font-semibold text-white">{selectedReview.title}</h4>
                )}
                <p className="text-slate-300 text-sm">{selectedReview.comment}</p>
              </div>

              {/* Response Input */}
              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Thank you for your feedback..."
                  rows={6}
                  className="bg-slate-800 border-slate-700"
                />
                <p className="text-xs text-slate-400">
                  Tip: Be professional, thank them for their feedback, and address any concerns they mentioned.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowResponseDialog(false)}
              className="border-slate-700"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitResponse}
              disabled={!responseText.trim()}
              className="bg-glacier-600 hover:bg-glacier-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Post Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
