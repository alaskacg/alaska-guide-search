import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Search,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Dispute {
  id: string;
  booking_id: string;
  dispute_type: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  raised_by: string;
  raised_by_type: 'client' | 'guide';
  subject: string;
  description: string;
  resolution_notes?: string;
  resolved_by?: string;
  resolved_at?: string;
  refund_amount?: number;
  created_at: string;
  updated_at: string;
  booking?: any;
  raised_by_profile?: any;
}

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  investigating: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export default function DisputeManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [refundAmount, setRefundAmount] = useState('');

  // Fetch disputes
  const { data: disputes, isLoading } = useQuery({
    queryKey: ['admin-disputes', statusFilter, priorityFilter],
    queryFn: async () => {
      let query = supabase
        .from('disputes')
        .select(`
          *,
          booking:bookings!disputes_booking_id_fkey(booking_number, total_price, status),
          raised_by_profile:profiles!disputes_raised_by_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }

      const { data, error } = await query;
      if (error) {
        // If disputes table doesn't exist, return empty array
        console.warn('Disputes table may not exist:', error);
        return [];
      }
      return data as Dispute[];
    },
  });

  // Update dispute mutation
  const updateDisputeMutation = useMutation({
    mutationFn: async ({
      disputeId,
      status,
      notes,
      refundAmount,
    }: {
      disputeId: string;
      status: string;
      notes: string;
      refundAmount?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates: any = {
        status,
        resolution_notes: notes,
        updated_at: new Date().toISOString(),
      };

      if (status === 'resolved' || status === 'closed') {
        updates.resolved_by = user.id;
        updates.resolved_at = new Date().toISOString();
        if (refundAmount) {
          updates.refund_amount = parseFloat(refundAmount.toString());
        }
      }

      const { data, error } = await supabase
        .from('disputes')
        .update(updates)
        .eq('id', disputeId)
        .select()
        .single();

      if (error) throw error;

      // If refund approved, update booking
      if (refundAmount && parseFloat(refundAmount.toString()) > 0) {
        const dispute = disputes?.find(d => d.id === disputeId);
        if (dispute?.booking_id) {
          await supabase
            .from('bookings')
            .update({
              refund_amount: parseFloat(refundAmount.toString()),
              status: 'cancelled',
            })
            .eq('id', dispute.booking_id);
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      setDetailsOpen(false);
      setSelectedDispute(null);
      setResolutionNotes('');
      setRefundAmount('');
      toast({ title: 'Success', description: 'Dispute updated successfully.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update dispute.',
        variant: 'destructive',
      });
    },
  });

  const filteredDisputes = disputes?.filter((dispute) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      dispute.subject.toLowerCase().includes(searchLower) ||
      dispute.description.toLowerCase().includes(searchLower) ||
      dispute.booking?.booking_number?.toLowerCase().includes(searchLower) ||
      dispute.raised_by_profile?.full_name?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const openDisputeDetails = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolutionNotes(dispute.resolution_notes || '');
    setRefundAmount(dispute.refund_amount?.toString() || '');
    setDetailsOpen(true);
  };

  const handleResolve = (status: 'resolved' | 'closed') => {
    if (!selectedDispute) return;

    updateDisputeMutation.mutate({
      disputeId: selectedDispute.id,
      status,
      notes: resolutionNotes,
      refundAmount: refundAmount ? parseFloat(refundAmount) : undefined,
    });
  };

  const stats = {
    open: disputes?.filter(d => d.status === 'open').length || 0,
    investigating: disputes?.filter(d => d.status === 'investigating').length || 0,
    resolved: disputes?.filter(d => d.status === 'resolved').length || 0,
    urgent: disputes?.filter(d => d.priority === 'urgent').length || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dispute Management</h1>
        <p className="text-gray-500 mt-1">Handle customer disputes and resolution</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Open Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Investigating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.investigating}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {disputes?.length === 0 && !isLoading && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            The disputes table may not be configured yet. Create a "disputes" table in your database with the following columns:
            id, booking_id, dispute_type, status, priority, raised_by, raised_by_type, subject, description, resolution_notes, resolved_by, resolved_at, refund_amount, created_at, updated_at.
          </AlertDescription>
        </Alert>
      )}

      {/* Disputes Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search disputes..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

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
                    <TableHead>Subject</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Raised By</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDisputes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                        No disputes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDisputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell>
                          <div className="font-medium">{dispute.subject}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {dispute.description}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {dispute.booking?.booking_number || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {dispute.raised_by_profile?.full_name || 'Unknown'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {dispute.raised_by_type}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{dispute.dispute_type || 'General'}</TableCell>
                        <TableCell>
                          <Badge className={priorityColors[dispute.priority]}>
                            {dispute.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[dispute.status]}>
                            {dispute.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(dispute.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDisputeDetails(dispute)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>
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

      {/* Dispute Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Review and resolve the dispute
            </DialogDescription>
          </DialogHeader>

          {selectedDispute && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="booking">Booking Info</TabsTrigger>
                <TabsTrigger value="resolution">Resolution</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Dispute Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">Subject:</span>
                      <span className="font-medium">{selectedDispute.subject}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">Type:</span>
                      <span>{selectedDispute.dispute_type || 'General'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">Priority:</span>
                      <Badge className={priorityColors[selectedDispute.priority]}>
                        {selectedDispute.priority}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">Status:</span>
                      <Badge className={statusColors[selectedDispute.status]}>
                        {selectedDispute.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">Raised By:</span>
                      <span>
                        {selectedDispute.raised_by_profile?.full_name} ({selectedDispute.raised_by_type})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">Created:</span>
                      <span>{format(new Date(selectedDispute.created_at), 'PPp')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedDispute.description}
                  </div>
                </div>

                {selectedDispute.resolution_notes && (
                  <div>
                    <h4 className="font-semibold mb-2">Previous Resolution Notes</h4>
                    <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                      {selectedDispute.resolution_notes}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="booking" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Booking Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Booking #:</span>
                      <span className="font-mono">{selectedDispute.booking?.booking_number}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Total Price:</span>
                      <span className="font-medium">${selectedDispute.booking?.total_price?.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-32">Booking Status:</span>
                      <Badge>{selectedDispute.booking?.status}</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resolution" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                  <Textarea
                    placeholder="Enter your resolution notes..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={5}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Refund Amount (if applicable)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  {selectedDispute.booking?.total_price && (
                    <p className="text-xs text-gray-500 mt-1">
                      Max refund: ${selectedDispute.booking.total_price.toFixed(2)}
                    </p>
                  )}
                </div>

                {selectedDispute.status !== 'resolved' && selectedDispute.status !== 'closed' && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => handleResolve('resolved')}
                      disabled={updateDisputeMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                    <Button
                      onClick={() => handleResolve('closed')}
                      disabled={updateDisputeMutation.isPending}
                      variant="outline"
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Close Dispute
                    </Button>
                  </div>
                )}

                {selectedDispute.resolved_at && (
                  <div className="text-sm text-gray-500 pt-2 border-t">
                    <p>Resolved on {format(new Date(selectedDispute.resolved_at), 'PPp')}</p>
                    {selectedDispute.refund_amount && (
                      <p className="font-medium text-green-600">
                        Refund issued: ${selectedDispute.refund_amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
