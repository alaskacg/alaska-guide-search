import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ExternalLink,
  Eye,
  Download,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GuideApplication {
  id: string;
  user_id: string;
  full_legal_name: string;
  email?: string;
  phone_number: string;
  business_name: string | null;
  date_of_birth: string;
  years_of_experience: number;
  bio: string | null;
  service_types: string[];
  service_areas: string[];
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  government_id_url: string | null;
  business_license_number: string | null;
  guide_license_url: string | null;
  insurance_certificate_url: string | null;
  cpr_first_aid_cert_url: string | null;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export default function GuideApproval() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [selectedApplication, setSelectedApplication] = useState<GuideApplication | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  // Fetch guide applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-guide-applications', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('guide_applications')
        .select('*')
        .order('created_at', { ascending: true });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as GuideApplication[];
    },
  });

  // Review application mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      notes 
    }: { 
      applicationId: string; 
      status: 'approved' | 'rejected'; 
      notes: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updates = {
        status,
        admin_notes: notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      };

      const { data: application, error } = await supabase
        .from('guide_applications')
        .update(updates)
        .eq('id', applicationId)
        .select()
        .single();

      if (error) throw error;

      // If approved, activate or create guide profile
      if (status === 'approved') {
        const guideProfileData = {
          application_id: applicationId,
          user_id: application.user_id,
          display_name: application.business_name || application.full_legal_name,
          business_name: application.business_name,
          bio: application.bio,
          service_types: application.service_types,
          service_areas: application.service_areas,
          years_of_experience: application.years_of_experience,
          is_verified: true,
          verified_at: new Date().toISOString(),
          is_active: true,
        };

        const { data: existingProfile } = await supabase
          .from('guide_profiles')
          .select('id')
          .eq('user_id', application.user_id)
          .maybeSingle();

        const profileOperation = existingProfile
          ? supabase
              .from('guide_profiles')
              .update(guideProfileData)
              .eq('id', existingProfile.id)
          : supabase
              .from('guide_profiles')
              .insert(guideProfileData);

        const { error: profileError } = await profileOperation;

        if (profileError) {
          // Rollback application status if profile creation fails
          await supabase
            .from('guide_applications')
            .update({ status: 'pending' })
            .eq('id', applicationId);
          
          throw new Error('Failed to create guide profile');
        }

        // Update user profile to guide type
        await supabase
          .from('profiles')
          .update({ user_type: 'guide' })
          .eq('id', application.user_id);
      } else {
        // Ensure rejected applicants are not publicly visible as active guides.
        await supabase
          .from('guide_profiles')
          .update({ is_active: false })
          .eq('user_id', application.user_id);
      }

      return application;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-guide-applications'] });
      setReviewDialogOpen(false);
      setSelectedApplication(null);
      setAdminNotes('');
      setReviewAction(null);
      
      toast({
        title: 'Success',
        description: `Application ${variables.status === 'approved' ? 'approved' : 'rejected'} successfully.`,
      });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to review application.';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });

  const filteredApplications = applications?.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.full_legal_name.toLowerCase().includes(searchLower) ||
      app.business_name?.toLowerCase().includes(searchLower) ||
      app.phone_number.includes(searchTerm) ||
      app.email?.toLowerCase().includes(searchLower)
    );
  }) || [];

  const openReviewDialog = (application: GuideApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewAction(action);
    setAdminNotes(application.admin_notes || '');
    setReviewDialogOpen(true);
  };

  const handleReview = () => {
    if (!selectedApplication || !reviewAction) return;

    reviewMutation.mutate({
      applicationId: selectedApplication.id,
      status: reviewAction === 'approve' ? 'approved' : 'rejected',
      notes: adminNotes,
    });
  };

  const downloadDocument = (url: string | null, filename: string) => {
    if (!url) {
      toast({ title: 'Error', description: 'Document not available.', variant: 'destructive' });
      return;
    }
    window.open(url, '_blank');
  };

  const stats = {
    pending: applications?.filter(a => a.status === 'pending').length || 0,
    approved: applications?.filter(a => a.status === 'approved').length || 0,
    rejected: applications?.filter(a => a.status === 'rejected').length || 0,
    under_review: applications?.filter(a => a.status === 'under_review').length || 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Guide Approvals</h1>
        <p className="text-gray-500 mt-1">Review and approve guide verification applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Under Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
                    <TableHead>Applicant</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{application.full_legal_name}</div>
                            <div className="text-xs text-gray-500">{application.phone_number}</div>
                          </div>
                        </TableCell>
                        <TableCell>{application.business_name || '-'}</TableCell>
                        <TableCell>{application.years_of_experience} years</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {application.service_types.slice(0, 2).map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                            {application.service_types.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{application.service_types.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(application.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              application.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : application.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : application.status === 'under_review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedApplication(application);
                                setReviewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                            {application.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => openReviewDialog(application, 'approve')}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => openReviewDialog(application, 'reject')}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
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

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reviewAction ? `${reviewAction === 'approve' ? 'Approve' : 'Reject'} Application` : 'Review Application'}
            </DialogTitle>
            <DialogDescription>
              {selectedApplication?.full_legal_name}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Legal Name:</span> {selectedApplication.full_legal_name}</p>
                      <p><span className="text-gray-500">Phone:</span> {selectedApplication.phone_number}</p>
                      <p><span className="text-gray-500">DOB:</span> {format(new Date(selectedApplication.date_of_birth), 'PP')}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Business Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Business Name:</span> {selectedApplication.business_name || 'N/A'}</p>
                      <p><span className="text-gray-500">License #:</span> {selectedApplication.business_license_number || 'N/A'}</p>
                      <p><span className="text-gray-500">Experience:</span> {selectedApplication.years_of_experience} years</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Services & Areas</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Service Types:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplication.service_types.map((type) => (
                          <Badge key={type}>{type}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Service Areas:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplication.service_areas.map((area) => (
                          <Badge key={area} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication.bio && (
                  <div>
                    <h4 className="font-semibold mb-2">Bio</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedApplication.bio}</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documents" className="space-y-3 mt-4">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => downloadDocument(selectedApplication.government_id_url, 'Government ID')}
                    disabled={!selectedApplication.government_id_url}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Government ID
                    </span>
                    {selectedApplication.government_id_url ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <span className="text-xs text-gray-500">Not provided</span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => downloadDocument(selectedApplication.guide_license_url, 'Guide License')}
                    disabled={!selectedApplication.guide_license_url}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Guide License
                    </span>
                    {selectedApplication.guide_license_url ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <span className="text-xs text-gray-500">Not provided</span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => downloadDocument(selectedApplication.insurance_certificate_url, 'Insurance Certificate')}
                    disabled={!selectedApplication.insurance_certificate_url}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Insurance Certificate
                    </span>
                    {selectedApplication.insurance_certificate_url ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <span className="text-xs text-gray-500">Not provided</span>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => downloadDocument(selectedApplication.cpr_first_aid_cert_url, 'CPR/First Aid Certificate')}
                    disabled={!selectedApplication.cpr_first_aid_cert_url}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      CPR/First Aid Certificate
                    </span>
                    {selectedApplication.cpr_first_aid_cert_url ? (
                      <ExternalLink className="w-4 h-4" />
                    ) : (
                      <span className="text-xs text-gray-500">Not provided</span>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="review" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                  <Textarea
                    placeholder="Add notes about this application review..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={6}
                  />
                </div>

                {selectedApplication.admin_notes && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Previous Notes</label>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedApplication.admin_notes}
                    </div>
                  </div>
                )}

                {selectedApplication.reviewed_at && (
                  <div className="text-sm text-gray-500">
                    <p>Reviewed on {format(new Date(selectedApplication.reviewed_at), 'PPp')}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {reviewAction && (
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setReviewDialogOpen(false);
                setReviewAction(null);
              }}>
                Cancel
              </Button>
              <Button
                onClick={handleReview}
                disabled={reviewMutation.isPending}
                className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {reviewMutation.isPending ? 'Processing...' : reviewAction === 'approve' ? 'Approve Application' : 'Reject Application'}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
