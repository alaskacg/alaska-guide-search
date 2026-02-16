import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, RotateCcw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface PlatformConfig {
  id?: string;
  platform_fee_percentage: number;
  min_booking_advance_hours: number;
  max_booking_advance_days: number;
  default_cancellation_policy: string;
  auto_approve_guides: boolean;
  require_insurance_verification: boolean;
  require_background_check: boolean;
  min_guide_experience_years: number;
  customer_support_email: string;
  platform_name: string;
  refund_processing_days: number;
  dispute_resolution_days: number;
  guide_payout_schedule: string;
  platform_currency: string;
  tax_rate_percentage: number;
  service_fee_cap_amount: number | null;
  terms_of_service_url: string | null;
  privacy_policy_url: string | null;
  maintenance_mode: boolean;
  featured_listing_fee: number;
  created_at?: string;
  updated_at?: string;
}

const defaultConfig: PlatformConfig = {
  platform_fee_percentage: 15,
  min_booking_advance_hours: 24,
  max_booking_advance_days: 365,
  default_cancellation_policy: 'moderate',
  auto_approve_guides: false,
  require_insurance_verification: true,
  require_background_check: true,
  min_guide_experience_years: 1,
  customer_support_email: 'support@alaskaguidesearch.com',
  platform_name: 'Alaska Guide Search',
  refund_processing_days: 7,
  dispute_resolution_days: 14,
  guide_payout_schedule: 'weekly',
  platform_currency: 'USD',
  tax_rate_percentage: 0,
  service_fee_cap_amount: null,
  terms_of_service_url: null,
  privacy_policy_url: null,
  maintenance_mode: false,
  featured_listing_fee: 49.99,
};

export default function PlatformSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [config, setConfig] = useState<PlatformConfig>(defaultConfig);
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch platform config
  const { isLoading } = useQuery({
    queryKey: ['platform-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('platform_config')
        .select('*')
        .single();

      if (error) {
        // If table doesn't exist or no config, use defaults
        console.warn('Platform config not found, using defaults:', error);
        return defaultConfig;
      }

      setConfig(data as PlatformConfig);
      return data as PlatformConfig;
    },
  });

  // Update config mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig: PlatformConfig) => {
      const configData = {
        ...newConfig,
        updated_at: new Date().toISOString(),
      };

      // Try to update existing config or insert new one
      const { data: existing } = await supabase
        .from('platform_config')
        .select('id')
        .single();

      let result;
      if (existing?.id) {
        result = await supabase
          .from('platform_config')
          .update(configData)
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('platform_config')
          .insert(configData)
          .select()
          .single();
      }

      if (result.error) throw result.error;
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['platform-config'], data);
      setConfig(data as PlatformConfig);
      setHasChanges(false);
      toast({ title: 'Success', description: 'Platform settings updated successfully.' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings. The platform_config table may not exist.',
        variant: 'destructive',
      });
    },
  });

  const handleChange = (field: keyof PlatformConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateConfigMutation.mutate(config);
  };

  const handleReset = () => {
    queryClient.invalidateQueries({ queryKey: ['platform-config'] });
    setHasChanges(false);
    toast({ title: 'Reset', description: 'Settings reset to saved values.' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-gray-500 mt-1">Configure platform-wide settings and policies</p>
        </div>
        <div className="flex gap-3">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || updateConfigMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            {updateConfigMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Note: The platform_config table needs to be created in your database with the appropriate columns.
          If it doesn't exist yet, settings will use defaults and save attempts will show an error.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="fees">Fees & Payments</TabsTrigger>
            <TabsTrigger value="booking">Booking Policies</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform_name">Platform Name</Label>
                    <Input
                      id="platform_name"
                      value={config.platform_name}
                      onChange={(e) => handleChange('platform_name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_support_email">Customer Support Email</Label>
                    <Input
                      id="customer_support_email"
                      type="email"
                      value={config.customer_support_email}
                      onChange={(e) => handleChange('customer_support_email', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform_currency">Currency</Label>
                    <Select
                      value={config.platform_currency}
                      onValueChange={(value) => handleChange('platform_currency', value)}
                    >
                      <SelectTrigger id="platform_currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">
                        Temporarily disable bookings for maintenance
                      </p>
                    </div>
                    <Switch
                      id="maintenance_mode"
                      checked={config.maintenance_mode}
                      onCheckedChange={(checked) => handleChange('maintenance_mode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees & Payments */}
          <TabsContent value="fees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>Configure platform fees and payment settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform_fee_percentage">Platform Fee (%)</Label>
                    <Input
                      id="platform_fee_percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={config.platform_fee_percentage}
                      onChange={(e) => handleChange('platform_fee_percentage', parseFloat(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Percentage charged on each booking
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service_fee_cap_amount">Service Fee Cap (optional)</Label>
                    <Input
                      id="service_fee_cap_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={config.service_fee_cap_amount || ''}
                      onChange={(e) => handleChange('service_fee_cap_amount', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="No cap"
                    />
                    <p className="text-xs text-gray-500">
                      Maximum platform fee per booking
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="featured_listing_fee">Featured Listing Fee</Label>
                    <Input
                      id="featured_listing_fee"
                      type="number"
                      min="0"
                      step="0.01"
                      value={config.featured_listing_fee}
                      onChange={(e) => handleChange('featured_listing_fee', parseFloat(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Monthly fee for featured listings
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax_rate_percentage">Tax Rate (%)</Label>
                    <Input
                      id="tax_rate_percentage"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={config.tax_rate_percentage}
                      onChange={(e) => handleChange('tax_rate_percentage', parseFloat(e.target.value))}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="guide_payout_schedule">Guide Payout Schedule</Label>
                    <Select
                      value={config.guide_payout_schedule}
                      onValueChange={(value) => handleChange('guide_payout_schedule', value)}
                    >
                      <SelectTrigger id="guide_payout_schedule">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refund_processing_days">Refund Processing Days</Label>
                    <Input
                      id="refund_processing_days"
                      type="number"
                      min="1"
                      max="30"
                      value={config.refund_processing_days}
                      onChange={(e) => handleChange('refund_processing_days', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Days to process refunds
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Booking Policies */}
          <TabsContent value="booking" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Booking Rules</CardTitle>
                <CardDescription>Configure booking and cancellation policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_booking_advance_hours">Minimum Advance Booking (hours)</Label>
                    <Input
                      id="min_booking_advance_hours"
                      type="number"
                      min="1"
                      value={config.min_booking_advance_hours}
                      onChange={(e) => handleChange('min_booking_advance_hours', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Minimum hours before service start
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_booking_advance_days">Maximum Advance Booking (days)</Label>
                    <Input
                      id="max_booking_advance_days"
                      type="number"
                      min="1"
                      value={config.max_booking_advance_days}
                      onChange={(e) => handleChange('max_booking_advance_days', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Maximum days in advance for bookings
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="default_cancellation_policy">Default Cancellation Policy</Label>
                    <Select
                      value={config.default_cancellation_policy}
                      onValueChange={(value) => handleChange('default_cancellation_policy', value)}
                    >
                      <SelectTrigger id="default_cancellation_policy">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible - Full refund 24hrs before</SelectItem>
                        <SelectItem value="moderate">Moderate - Full refund 7 days before</SelectItem>
                        <SelectItem value="strict">Strict - Full refund 14 days before</SelectItem>
                        <SelectItem value="super_strict">Super Strict - 50% refund 30 days before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dispute_resolution_days">Dispute Resolution Period (days)</Label>
                    <Input
                      id="dispute_resolution_days"
                      type="number"
                      min="1"
                      max="90"
                      value={config.dispute_resolution_days}
                      onChange={(e) => handleChange('dispute_resolution_days', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Days to resolve disputes before auto-close
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Settings */}
          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guide Verification Requirements</CardTitle>
                <CardDescription>Configure guide approval and verification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto_approve_guides">Auto-Approve Guides</Label>
                      <p className="text-sm text-gray-500">
                        Automatically approve guide applications without review
                      </p>
                    </div>
                    <Switch
                      id="auto_approve_guides"
                      checked={config.auto_approve_guides}
                      onCheckedChange={(checked) => handleChange('auto_approve_guides', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="require_insurance_verification">Require Insurance</Label>
                      <p className="text-sm text-gray-500">
                        Guides must provide proof of insurance
                      </p>
                    </div>
                    <Switch
                      id="require_insurance_verification"
                      checked={config.require_insurance_verification}
                      onCheckedChange={(checked) => handleChange('require_insurance_verification', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="require_background_check">Require Background Check</Label>
                      <p className="text-sm text-gray-500">
                        Guides must pass background check
                      </p>
                    </div>
                    <Switch
                      id="require_background_check"
                      checked={config.require_background_check}
                      onCheckedChange={(checked) => handleChange('require_background_check', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="min_guide_experience_years">Minimum Experience (years)</Label>
                    <Input
                      id="min_guide_experience_years"
                      type="number"
                      min="0"
                      max="50"
                      value={config.min_guide_experience_years}
                      onChange={(e) => handleChange('min_guide_experience_years', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-gray-500">
                      Minimum years of guiding experience required
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Settings */}
          <TabsContent value="legal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Legal Documents</CardTitle>
                <CardDescription>Links to terms of service and privacy policy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="terms_of_service_url">Terms of Service URL</Label>
                    <Input
                      id="terms_of_service_url"
                      type="url"
                      placeholder="https://example.com/terms"
                      value={config.terms_of_service_url || ''}
                      onChange={(e) => handleChange('terms_of_service_url', e.target.value || null)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="privacy_policy_url">Privacy Policy URL</Label>
                    <Input
                      id="privacy_policy_url"
                      type="url"
                      placeholder="https://example.com/privacy"
                      value={config.privacy_policy_url || ''}
                      onChange={(e) => handleChange('privacy_policy_url', e.target.value || null)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border p-4 flex items-center gap-4">
          <p className="text-sm font-medium">You have unsaved changes</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleReset}>
              Discard
            </Button>
            <Button size="sm" onClick={handleSave} disabled={updateConfigMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
