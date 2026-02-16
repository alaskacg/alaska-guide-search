import { useState } from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Calendar as CalendarIcon,
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  Download,
  Users,
} from 'lucide-react';
import { format, subDays, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}

const MetricCard = ({ title, value, change, icon, trend = 'up' }: MetricCardProps) => {
  const isPositive = trend === 'up' ? change > 0 : change < 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "text-xs mt-1",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {isPositive ? '+' : ''}{change}% from last period
        </p>
      </CardContent>
    </Card>
  );
};

export default function Analytics() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Mock data - replace with actual API calls
  const revenueData = {
    daily: [
      { date: '2024-01-01', revenue: 450, bookings: 3 },
      { date: '2024-01-02', revenue: 780, bookings: 5 },
      { date: '2024-01-03', revenue: 320, bookings: 2 },
      { date: '2024-01-04', revenue: 890, bookings: 6 },
      { date: '2024-01-05', revenue: 1200, bookings: 8 },
      { date: '2024-01-06', revenue: 950, bookings: 7 },
      { date: '2024-01-07', revenue: 670, bookings: 4 },
      { date: '2024-01-08', revenue: 1100, bookings: 9 },
      { date: '2024-01-09', revenue: 840, bookings: 6 },
      { date: '2024-01-10', revenue: 1050, bookings: 7 },
    ],
    weekly: [
      { date: 'Week 1', revenue: 4200, bookings: 28 },
      { date: 'Week 2', revenue: 5100, bookings: 34 },
      { date: 'Week 3', revenue: 4800, bookings: 31 },
      { date: 'Week 4', revenue: 6200, bookings: 42 },
    ],
    monthly: [
      { date: 'Aug', revenue: 18500, bookings: 124 },
      { date: 'Sep', revenue: 22300, bookings: 148 },
      { date: 'Oct', revenue: 19800, bookings: 132 },
      { date: 'Nov', revenue: 24600, bookings: 165 },
      { date: 'Dec', revenue: 28900, bookings: 193 },
      { date: 'Jan', revenue: 21200, bookings: 142 },
    ],
  };

  const servicePerformance = [
    { name: 'Fishing Tours', bookings: 145, revenue: 29000, rating: 4.8 },
    { name: 'Wildlife Viewing', bookings: 98, revenue: 19600, rating: 4.9 },
    { name: 'Glacier Hiking', bookings: 76, revenue: 22800, rating: 4.7 },
    { name: 'Kayaking', bookings: 62, revenue: 12400, rating: 4.6 },
    { name: 'Dog Sledding', bookings: 54, revenue: 16200, rating: 4.9 },
    { name: 'Northern Lights', bookings: 43, revenue: 12900, rating: 4.8 },
  ];

  const customerDemographics = [
    { name: 'USA', value: 45, color: '#0088FE' },
    { name: 'Canada', value: 20, color: '#00C49F' },
    { name: 'UK', value: 15, color: '#FFBB28' },
    { name: 'Germany', value: 10, color: '#FF8042' },
    { name: 'Other', value: 10, color: '#8884d8' },
  ];

  const ageGroups = [
    { name: '18-25', value: 15 },
    { name: '26-35', value: 30 },
    { name: '36-45', value: 25 },
    { name: '46-55', value: 20 },
    { name: '56+', value: 10 },
  ];

  const metrics = [
    {
      title: 'Total Revenue',
      value: '$28,950',
      change: 12.5,
      icon: <DollarSign className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: 'Active Bookings',
      value: '24',
      change: 8.2,
      icon: <CalendarIcon className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: 'Completion Rate',
      value: '94.5%',
      change: 3.1,
      icon: <CheckCircle className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: 'Average Rating',
      value: '4.8',
      change: 2.4,
      icon: <Star className="h-4 w-4" />,
      trend: 'up' as const,
    },
    {
      title: 'Response Time',
      value: '2.3h',
      change: -15.2,
      icon: <Clock className="h-4 w-4" />,
      trend: 'down' as const,
    },
    {
      title: 'Acceptance Rate',
      value: '87%',
      change: 5.8,
      icon: <TrendingUp className="h-4 w-4" />,
      trend: 'up' as const,
    },
  ];

  const handleExportData = () => {
    // Generate CSV data
    const csvData = [
      ['Metric', 'Value', 'Change'],
      ...metrics.map(m => [m.title, m.value, `${m.change}%`]),
      [],
      ['Service', 'Bookings', 'Revenue', 'Rating'],
      ...servicePerformance.map(s => [s.name, s.bookings, `$${s.revenue}`, s.rating]),
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your performance and gain insights into your business
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Date Range Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <Button onClick={handleExportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Revenue & Bookings</CardTitle>
              <CardDescription>Track your revenue and booking trends over time</CardDescription>
            </div>
            <Select value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueData[timeframe]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                name="Revenue ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Service Performance & Demographics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
            <CardDescription>Compare performance across your services</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="bookings">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bookings" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={servicePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="revenue" className="mt-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={servicePerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>

            {/* Top Performing Services List */}
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold">Top Performers</h4>
              {servicePerformance.slice(0, 3).map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.bookings} bookings
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">${service.revenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {service.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Demographics</CardTitle>
            <CardDescription>Understand your customer base</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="geography">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="geography">Geography</TabsTrigger>
                <TabsTrigger value="age">Age Groups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="geography" className="mt-4">
                <div className="flex flex-col items-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={customerDemographics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {customerDemographics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    {customerDemographics.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">
                          {item.name}: {item.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="age" className="mt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Most common age group:</span>
                    <span className="text-muted-foreground">26-35 years (30%)</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Peak Booking Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">9 AM - 12 PM</span>
                <span className="font-semibold">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }} />
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-muted-foreground">12 PM - 3 PM</span>
                <span className="font-semibold">30%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }} />
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-muted-foreground">3 PM - 6 PM</span>
                <span className="font-semibold">25%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Lead Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">0-7 days</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">8-30 days</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">30+ days</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                Average: 18 days in advance
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">68%</div>
                <p className="text-sm text-muted-foreground mt-1">Repeat customers</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New customers</span>
                  <span className="font-medium">32%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">2-3 bookings</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">4+ bookings</span>
                  <span className="font-medium">23%</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-3">
                Average customer lifetime: 3.2 bookings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
