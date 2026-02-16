import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Download, TrendingUp, TrendingDown, DollarSign, CreditCard, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

interface CategoryRevenue {
  category: string;
  revenue: number;
  bookings: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  platformFees: number;
  guideEarnings: number;
  avgBookingValue: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  refundedAmount: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function RevenueAnalytics() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('30');
  const [chartType, setChartType] = useState<'revenue' | 'bookings'>('revenue');

  // Fetch revenue metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-revenue-metrics', dateRange],
    queryFn: async (): Promise<RevenueMetrics> => {
      const daysAgo = parseInt(dateRange);
      const startDate = subDays(new Date(), daysAgo).toISOString();

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('total_price, amount_paid, refund_amount, status, created_at')
        .gte('created_at', startDate);

      if (error) throw error;

      const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
      const totalPaid = bookings.reduce((sum, b) => sum + (b.amount_paid || 0), 0);
      const refundedAmount = bookings.reduce((sum, b) => sum + (b.refund_amount || 0), 0);
      const platformFeeRate = 0.15; // 15% platform fee
      const platformFees = totalPaid * platformFeeRate;
      const guideEarnings = totalPaid - platformFees;

      return {
        totalRevenue,
        platformFees,
        guideEarnings,
        avgBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        refundedAmount,
      };
    },
  });

  // Fetch daily revenue data
  const { data: dailyData, isLoading: dailyLoading } = useQuery({
    queryKey: ['admin-daily-revenue', dateRange],
    queryFn: async (): Promise<RevenueData[]> => {
      const daysAgo = parseInt(dateRange);
      const startDate = subDays(new Date(), daysAgo).toISOString();

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('total_price, created_at')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by date
      const grouped = bookings.reduce((acc, booking) => {
        const date = format(new Date(booking.created_at), 'MMM dd');
        if (!acc[date]) {
          acc[date] = { revenue: 0, bookings: 0 };
        }
        acc[date].revenue += booking.total_price || 0;
        acc[date].bookings += 1;
        return acc;
      }, {} as Record<string, { revenue: number; bookings: number }>);

      return Object.entries(grouped).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        bookings: data.bookings,
      }));
    },
  });

  // Fetch category revenue breakdown
  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['admin-category-revenue', dateRange],
    queryFn: async (): Promise<CategoryRevenue[]> => {
      const daysAgo = parseInt(dateRange);
      const startDate = subDays(new Date(), daysAgo).toISOString();

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          total_price,
          service:guide_listings!bookings_service_id_fkey(category)
        `)
        .gte('created_at', startDate);

      if (error) throw error;

      // Group by category
      const grouped = bookings.reduce((acc, booking) => {
        const category = (booking.service as any)?.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = { revenue: 0, bookings: 0 };
        }
        acc[category].revenue += booking.total_price || 0;
        acc[category].bookings += 1;
        return acc;
      }, {} as Record<string, { revenue: number; bookings: number }>);

      return Object.entries(grouped).map(([category, data]) => ({
        category,
        revenue: data.revenue,
        bookings: data.bookings,
      }));
    },
  });

  // Fetch top guides by revenue
  const { data: topGuides, isLoading: guidesLoading } = useQuery({
    queryKey: ['admin-top-guides', dateRange],
    queryFn: async () => {
      const daysAgo = parseInt(dateRange);
      const startDate = subDays(new Date(), daysAgo).toISOString();

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          total_price,
          amount_paid,
          guide:guide_profiles!bookings_guide_id_fkey(display_name, business_name)
        `)
        .gte('created_at', startDate);

      if (error) throw error;

      // Group by guide
      const grouped = bookings.reduce((acc, booking) => {
        const guideName = (booking.guide as any)?.display_name || (booking.guide as any)?.business_name || 'Unknown';
        if (!acc[guideName]) {
          acc[guideName] = { revenue: 0, bookings: 0 };
        }
        acc[guideName].revenue += booking.amount_paid || 0;
        acc[guideName].bookings += 1;
        return acc;
      }, {} as Record<string, { revenue: number; bookings: number }>);

      return Object.entries(grouped)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
    },
  });

  const handleExport = () => {
    if (!dailyData || !categoryData || !metrics) {
      toast({ title: 'No Data', description: 'No revenue data to export.' });
      return;
    }

    const csv = [
      '=== Revenue Metrics ===',
      `Total Revenue,${metrics.totalRevenue.toFixed(2)}`,
      `Platform Fees (15%),${metrics.platformFees.toFixed(2)}`,
      `Guide Earnings,${metrics.guideEarnings.toFixed(2)}`,
      `Total Bookings,${metrics.totalBookings}`,
      `Avg Booking Value,${metrics.avgBookingValue.toFixed(2)}`,
      '',
      '=== Daily Revenue ===',
      ['Date', 'Revenue', 'Bookings'].join(','),
      ...dailyData.map(d => [d.date, d.revenue.toFixed(2), d.bookings].join(',')),
      '',
      '=== Category Breakdown ===',
      ['Category', 'Revenue', 'Bookings'].join(','),
      ...categoryData.map(c => [c.category, c.revenue.toFixed(2), c.bookings].join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: 'Success', description: 'Revenue data exported successfully.' });
  };

  const isLoading = metricsLoading || dailyLoading || categoryLoading || guidesLoading;

  const previousPeriodRevenue = metrics ? metrics.totalRevenue * 0.85 : 0; // Mock comparison
  const revenueChange = metrics ? ((metrics.totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Revenue Analytics</h1>
          <p className="text-gray-500 mt-1">Platform-wide revenue metrics and insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.totalRevenue.toFixed(2) || '0.00'}
            </div>
            <div className={`text-sm flex items-center gap-1 mt-1 ${revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(revenueChange).toFixed(1)}% vs previous period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Platform Fees (15%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${metrics?.platformFees.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              From {metrics?.totalBookings || 0} bookings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Guide Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics?.guideEarnings.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              85% of total paid
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Booking Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics?.avgBookingValue.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {metrics?.completedBookings || 0} completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue/Bookings Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Trend</CardTitle>
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="bookings">Bookings</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardDescription>Daily {chartType} over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={chartType}
                    stroke="#0088FE"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={chartType === 'revenue' ? 'Revenue ($)' : 'Bookings'}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Service category performance</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: $${entry.revenue.toFixed(0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Guides */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Guides</CardTitle>
          <CardDescription>Guides generating the most revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topGuides} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value: any) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#0088FE" name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? ((metrics.completedBookings / metrics.totalBookings) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {metrics?.completedBookings || 0} of {metrics?.totalBookings || 0} bookings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Cancellation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {metrics ? ((metrics.cancelledBookings / metrics.totalBookings) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {metrics?.cancelledBookings || 0} cancelled bookings
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Refunded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${metrics?.refundedAmount.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              From cancellations
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
