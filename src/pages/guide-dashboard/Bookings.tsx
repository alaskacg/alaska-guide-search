import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Download,
  Users,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { GuideProfile } from "@/hooks/useGuideProfile";
import { Booking, BookingStatus } from "@/types/booking";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardContext {
  profile: GuideProfile | null;
}

interface BookingWithDetails extends Booking {
  service_title?: string;
  service_type?: string;
}

const statusConfig = {
  pending: { color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: AlertCircle, label: "Pending" },
  confirmed: { color: "bg-green-500/20 text-green-300 border-green-500/30", icon: CheckCircle2, label: "Confirmed" },
  in_progress: { color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: Clock, label: "In Progress" },
  completed: { color: "bg-slate-500/20 text-slate-300 border-slate-500/30", icon: CheckCircle2, label: "Completed" },
  cancelled: { color: "bg-red-500/20 text-red-300 border-red-500/30", icon: XCircle, label: "Cancelled" },
  disputed: { color: "bg-orange-500/20 text-orange-300 border-orange-500/30", icon: AlertCircle, label: "Disputed" },
  refunded: { color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: DollarSign, label: "Refunded" },
};

export default function Bookings() {
  const { profile } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Simulate data loading
  useState(() => {
    const mockBookings: BookingWithDetails[] = [
      {
        id: "1",
        booking_number: "BK-2024-001",
        client_id: "client1",
        guide_id: profile?.id || "",
        service_id: "service1",
        service_title: "Full Day Salmon Fishing",
        service_type: "fishing",
        status: BookingStatus.PENDING,
        start_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 3).toISOString(),
        start_time: "06:00",
        end_time: "18:00",
        participants: 4,
        total_price: 1200,
        deposit_amount: 360,
        amount_paid: 360,
        amount_due: 840,
        payment_type: "deposit" as const,
        client_details: {
          name: "John Smith",
          email: "john.smith@email.com",
          phone: "+1 (907) 555-0123",
        },
        special_requests: "Prefer early morning departure",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "2",
        booking_number: "BK-2024-002",
        client_id: "client2",
        guide_id: profile?.id || "",
        service_id: "service2",
        service_title: "Grizzly Bear Viewing Experience",
        service_type: "wildlife_viewing",
        status: BookingStatus.CONFIRMED,
        start_date: new Date(Date.now() + 86400000 * 7).toISOString(),
        end_date: new Date(Date.now() + 86400000 * 7).toISOString(),
        start_time: "08:00",
        end_time: "16:00",
        participants: 2,
        total_price: 800,
        amount_paid: 800,
        amount_due: 0,
        payment_type: "full" as const,
        client_details: {
          name: "Sarah Johnson",
          email: "sarah.j@email.com",
          phone: "+1 (907) 555-0456",
        },
        confirmed_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: "3",
        booking_number: "BK-2024-003",
        client_id: "client3",
        guide_id: profile?.id || "",
        service_id: "service1",
        service_title: "Full Day Salmon Fishing",
        service_type: "fishing",
        status: BookingStatus.COMPLETED,
        start_date: new Date(Date.now() - 86400000 * 5).toISOString(),
        end_date: new Date(Date.now() - 86400000 * 5).toISOString(),
        start_time: "06:00",
        end_time: "18:00",
        participants: 3,
        total_price: 900,
        amount_paid: 900,
        amount_due: 0,
        payment_type: "full" as const,
        client_details: {
          name: "Michael Brown",
          email: "mbrown@email.com",
          phone: "+1 (907) 555-0789",
        },
        completed_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];
    setBookings(mockBookings);
    setTimeout(() => setLoading(false), 500);
  });

  const filterBookings = (status: BookingStatus | "all" | "upcoming") => {
    let filtered = bookings;

    // Filter by status/upcoming
    if (status === "upcoming") {
      filtered = filtered.filter(b => 
        new Date(b.start_date) > new Date() && 
        (b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.PENDING)
      );
    } else if (status !== "all") {
      filtered = filtered.filter(b => b.status === status);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.booking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.client_details.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.client_details.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by service
    if (selectedService !== "all") {
      filtered = filtered.filter(b => b.service_type === selectedService);
    }

    return filtered;
  };

  const handleConfirmBooking = async (booking: BookingWithDetails) => {
    try {
      setBookings(prev => prev.map(b => 
        b.id === booking.id 
          ? { ...b, status: BookingStatus.CONFIRMED, confirmed_at: new Date().toISOString() }
          : b
      ));
      toast({
        title: "Booking Confirmed",
        description: `Booking ${booking.booking_number} has been confirmed.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to confirm booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { 
              ...b, 
              status: BookingStatus.CANCELLED, 
              cancellation_requested_at: new Date().toISOString(),
              cancellation_reason: cancelReason,
              cancelled_by: "guide"
            }
          : b
      ));
      
      toast({
        title: "Booking Cancelled",
        description: `Booking ${selectedBooking.booking_number} has been cancelled.`,
      });
      
      setShowCancelDialog(false);
      setShowDetails(false);
      setCancelReason("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  const handleMessageCustomer = (booking: BookingWithDetails) => {
    toast({
      title: "Messages",
      description: "Messaging feature coming soon!",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const BookingCard = ({ booking }: { booking: BookingWithDetails }) => {
    const StatusIcon = statusConfig[booking.status].icon;
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg truncate">{booking.service_title}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-glacier-400">{booking.booking_number}</span>
                </CardDescription>
              </div>
              <Badge className={`${statusConfig[booking.status].color} border whitespace-nowrap`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {statusConfig[booking.status].label}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-slate-500" />
                <span className="truncate">{booking.client_details.name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>{formatDate(booking.start_date)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{booking.start_time} - {booking.end_time}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-slate-500" />
                <span>{booking.participants} participant{booking.participants > 1 ? 's' : ''}</span>
              </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-glacier-400">
                  {formatCurrency(booking.total_price)}
                </div>
                {booking.amount_due > 0 && (
                  <div className="text-xs text-slate-400">
                    {formatCurrency(booking.amount_due)} remaining
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {booking.status === BookingStatus.PENDING && (
                  <Button
                    size="sm"
                    onClick={() => handleConfirmBooking(booking)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Confirm
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(booking)}
                  className="border-slate-700"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleMessageCustomer(booking)}
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>
            {(booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedBooking(booking);
                  setShowCancelDialog(true);
                }}
                className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <Calendar className="w-16 h-16 mx-auto text-slate-600 mb-4" />
      <p className="text-slate-400 text-lg">{message}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bookings</h1>
        <p className="text-slate-400">Manage your tour bookings and reservations</p>
      </div>

      {/* Filters */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search by name or booking number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
            
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="fishing">Fishing</SelectItem>
                <SelectItem value="hunting">Hunting</SelectItem>
                <SelectItem value="wildlife_viewing">Wildlife Viewing</SelectItem>
                <SelectItem value="glacier_tours">Glacier Tours</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <Skeleton className="h-6 w-2/3 bg-slate-800" />
                    <Skeleton className="h-4 w-1/3 bg-slate-800" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 bg-slate-800" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filterBookings("upcoming").length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4">
                {filterBookings("upcoming").map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <EmptyState message="No upcoming bookings" />
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-64 bg-slate-800" />
              ))}
            </div>
          ) : filterBookings(BookingStatus.PENDING).length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4">
                {filterBookings(BookingStatus.PENDING).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <EmptyState message="No pending bookings" />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-64 bg-slate-800" />
              ))}
            </div>
          ) : filterBookings(BookingStatus.COMPLETED).length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4">
                {filterBookings(BookingStatus.COMPLETED).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <EmptyState message="No completed bookings" />
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1].map(i => (
                <Skeleton key={i} className="h-64 bg-slate-800" />
              ))}
            </div>
          ) : filterBookings(BookingStatus.CANCELLED).length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4">
                {filterBookings(BookingStatus.CANCELLED).map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <EmptyState message="No cancelled bookings" />
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking?.booking_number}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Badge className={`${statusConfig[selectedBooking.status].color} border`}>
                    {statusConfig[selectedBooking.status].label}
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-glacier-400">
                      {formatCurrency(selectedBooking.total_price)}
                    </div>
                    {selectedBooking.amount_due > 0 && (
                      <div className="text-sm text-slate-400">
                        {formatCurrency(selectedBooking.amount_due)} due
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="bg-slate-800" />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-400">Service</Label>
                      <p className="text-white font-medium mt-1">{selectedBooking.service_title}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Date</Label>
                      <p className="text-white font-medium mt-1">{formatDate(selectedBooking.start_date)}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Time</Label>
                      <p className="text-white font-medium mt-1">
                        {selectedBooking.start_time} - {selectedBooking.end_time}
                      </p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Participants</Label>
                      <p className="text-white font-medium mt-1">{selectedBooking.participants}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-slate-400">Customer Name</Label>
                      <p className="text-white font-medium mt-1">{selectedBooking.client_details.name}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Email</Label>
                      <p className="text-white font-medium mt-1">{selectedBooking.client_details.email}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Phone</Label>
                      <p className="text-white font-medium mt-1">{selectedBooking.client_details.phone}</p>
                    </div>
                    <div>
                      <Label className="text-slate-400">Payment Type</Label>
                      <p className="text-white font-medium mt-1 capitalize">{selectedBooking.payment_type}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.special_requests && (
                  <>
                    <Separator className="bg-slate-800" />
                    <div>
                      <Label className="text-slate-400">Special Requests</Label>
                      <p className="text-white mt-2">{selectedBooking.special_requests}</p>
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => handleMessageCustomer(selectedBooking)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Customer
                  </Button>
                  <Button variant="outline" className="border-slate-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel booking {selectedBooking?.booking_number}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="cancel-reason" className="text-slate-400">
              Cancellation Reason
            </Label>
            <Textarea
              id="cancel-reason"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancellation..."
              className="mt-2 bg-slate-800 border-slate-700"
              rows={3}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-800 border-slate-700">
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
