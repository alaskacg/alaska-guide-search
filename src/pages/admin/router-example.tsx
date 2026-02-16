/**
 * Example Router Configuration for Admin Dashboard
 * 
 * Add this to your App.tsx or main router file
 */

import { createBrowserRouter } from 'react-router-dom';
import {
  AdminDashboard,
  AllBookings,
  GuideApproval,
  RevenueAnalytics,
  DisputeManagement,
  PlatformSettings,
} from '@/pages/admin';

// Example router configuration
export const router = createBrowserRouter([
  // ... your existing routes
  
  // Admin Dashboard Routes
  {
    path: '/admin',
    element: <AdminDashboard />, // Main layout with sidebar
    children: [
      {
        index: true, // Default route: /admin
        element: <RevenueAnalytics />, // Shows revenue dashboard by default
      },
      {
        path: 'bookings', // Route: /admin/bookings
        element: <AllBookings />,
      },
      {
        path: 'approvals', // Route: /admin/approvals
        element: <GuideApproval />,
      },
      {
        path: 'revenue', // Route: /admin/revenue
        element: <RevenueAnalytics />,
      },
      {
        path: 'disputes', // Route: /admin/disputes
        element: <DisputeManagement />,
      },
      {
        path: 'settings', // Route: /admin/settings
        element: <PlatformSettings />,
      },
    ],
  },
  
  // ... rest of your routes
]);

/**
 * Alternative: If using Routes component instead of createBrowserRouter
 */

/*
import { Routes, Route } from 'react-router-dom';

<Routes>
  // ... your existing routes
  
  <Route path="/admin" element={<AdminDashboard />}>
    <Route index element={<RevenueAnalytics />} />
    <Route path="bookings" element={<AllBookings />} />
    <Route path="approvals" element={<GuideApproval />} />
    <Route path="revenue" element={<RevenueAnalytics />} />
    <Route path="disputes" element={<DisputeManagement />} />
    <Route path="settings" element={<PlatformSettings />} />
  </Route>
  
  // ... rest of your routes
</Routes>
*/

/**
 * Access Control Notes:
 * 
 * 1. AdminDashboard.tsx already checks for user_type = 'admin'
 * 2. Non-admin users are automatically redirected to home page
 * 3. Access check happens on component mount
 * 
 * For additional protection, you can add a route guard:
 */

/*
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  
  useEffect(() => {
    checkAdmin();
  }, []);
  
  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsAdmin(false);
      return;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();
    
    setIsAdmin(profile?.user_type === 'admin');
  }
  
  if (isAdmin === null) return <div>Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  
  return <>{children}</>;
}

// Then wrap your admin routes:
<Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
  ...
</Route>
*/
