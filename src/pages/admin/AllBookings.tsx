import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Booking {
  id: string;
  booking_number: string;
  client_id: string;
  guide_id: string;
  service_id: string;
  status: string;
  start_date: string;
  start_time: string;
  participants: number;
  total_price: number;
  amount_paid: number;
  amount_due: number;
  created_at: string;
  client_details?: any;
  guide?: any;
  service?: any;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AllBookings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch all bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings', statusFilter, dateFilter],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name, email, phone),
          guide:guide_profiles!bookings_guide_id_fkey(display_name, business_name),
          service:guide_listings!bookings_service_id_fkey(title, category)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (dateFilter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        query = query.gte('start_date', today).lt('start_date', new Date(Date.now() + 86400000).toISOString().split('T')[0]);
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        query = query.gte('start_date', weekAgo);
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
        query = query.gte('start_date', monthAgo);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Booking[];
    },
  });

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'Success', description: 'Booking status updated.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update booking status.',
        variant: 'destructive',
      });
    },
  });

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ bookingIds, status }: { bookingIds: string[]; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .in('id', bookingIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      setSelectedBookings([]);
      toast({ title: 'Success', description: 'Bookings updated.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update bookings.',
        variant: 'destructive',
      });
    },
  });

  const filteredBookings = bookings?.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.booking_number.toLowerCase().includes(searchLower) ||
      booking.client_details?.email?.toLowerCase().includes(searchLower) ||
      booking.guide?.display_name?.toLowerCase().includes(searchLower) ||
      booking.service?.title?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleExport = () => {
    if (!filteredBookings.length) {
      toast({ title: 'No Data', description: 'No bookings to export.' });
      return;
    }

    const csv = [
      ['Booking #', 'Client', 'Guide', 'Service', 'Date', 'Status', 'Total', 'Paid', 'Due'].join(','),
      ...filteredBookings.map(b => [
        b.booking_number,
        b.client_details?.name || 'N/A',
        b.guide?.display_name || 'N/A',
        b.service?.title || 'N/A',
        b.start_date,
        b.status,
        b.total_price,
        b.amount_paid,
        b.amount_due,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Success', description: 'Bookings exported successfully.' });
  };

  const toggleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(b => b.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedBookings(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (status: string) => {
    if (selectedBookings.length === 0) {
      toast({ title: 'No Selection', description: 'Please select bookings first.' });
      return;
    }
    bulkUpdateMutation.mutate({ bookingIds: selectedBookings, status });
  };

  const totalRevenue = filteredBookings.reduce((sum, b) => sum + b.total_price, 0);
  const totalPaid = filteredBookings.reduce((sum, b) => sum + b.amount_paid, 0);
  const totalDue = filteredBookings.reduce((sum, b) => sum + b.amount_due, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <p className="text-gray-500 mt-1">Manage and monitor all platform bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Amount Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalDue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>

        {selectedBookings.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedBookings.length} selected
              </span>
              <div className="flex-1" />
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('confirmed')}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('cancelled')}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Booking #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Guide</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-gray-500">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedBookings.includes(booking.id)}
                            onCheckedChange={() => toggleSelect(booking.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{booking.booking_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.client_details?.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{booking.client_details?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{booking.guide?.display_name || booking.guide?.business_name || 'N/A'}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.service?.title || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{booking.service?.category}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(booking.start_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500">{booking.start_time}</div>
                        </TableCell>
                        <TableCell>{booking.participants}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[booking.status] || 'bg-gray-100 text-gray-800'}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${booking.total_price.toFixed(2)}</div>
                          {booking.amount_due > 0 && (
                            <div className="text-xs text-orange-600">
                              ${booking.amount_due.toFixed(2)} due
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedBooking(booking);
                                setDetailsOpen(true);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {booking.status === 'pending' && (
                                <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: 'confirmed' })}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm
                                </DropdownMenuItem>
                              )}
                              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                                <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: 'cancelled' })}>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              {selectedBooking?.booking_number}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Client Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Name:</span> {selectedBooking.client_details?.name}</p>
                    <p><span className="text-gray-500">Email:</span> {selectedBooking.client_details?.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedBooking.client_details?.phone}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Booking Information</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500">Date:</span> {format(new Date(selectedBooking.start_date), 'PPP')}</p>
                    <p><span className="text-gray-500">Time:</span> {selectedBooking.start_time}</p>
                    <p><span className="text-gray-500">Participants:</span> {selectedBooking.participants}</p>
                    <p><span className="text-gray-500">Status:</span> <Badge className={statusColors[selectedBooking.status]}>{selectedBooking.status}</Badge></p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Financial Details</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Total Price:</span> ${selectedBooking.total_price.toFixed(2)}</p>
                  <p><span className="text-gray-500">Amount Paid:</span> ${selectedBooking.amount_paid.toFixed(2)}</p>
                  <p><span className="text-gray-500">Amount Due:</span> ${selectedBooking.amount_due.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Guide & Service</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Guide:</span> {selectedBooking.guide?.display_name || 'N/A'}</p>
                  <p><span className="text-gray-500">Service:</span> {selectedBooking.service?.title || 'N/A'}</p>
                  <p><span className="text-gray-500">Category:</span> {selectedBooking.service?.category || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
