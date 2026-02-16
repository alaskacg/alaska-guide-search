import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  Calendar,
  UserCheck,
  DollarSign,
  AlertCircle,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: 'Overview', href: '/admin', icon: LayoutDashboard },
  { title: 'All Bookings', href: '/admin/bookings', icon: Calendar },
  { title: 'Guide Approvals', href: '/admin/approvals', icon: UserCheck },
  { title: 'Revenue Analytics', href: '/admin/revenue', icon: DollarSign },
  { title: 'Dispute Management', href: '/admin/disputes', icon: AlertCircle },
  { title: 'Platform Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        toast({
          title: 'Access Denied',
          description: 'You must be logged in to access the admin dashboard.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type, full_name, avatar_url')
        .eq('id', currentUser.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Unable to fetch user profile');
      }

      if (profile.user_type !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard.',
          variant: 'destructive',
        });
        navigate('/');
        return;
      }

      setUser({ ...currentUser, ...profile });
    } catch (error: any) {
      console.error('Admin access check failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify admin access.',
        variant: 'destructive',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r">
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3 px-2">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                {user.full_name?.[0] || 'A'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.full_name || user.email}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-primary">Admin Panel</h1>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex flex-col h-full">
              <div className="h-16 flex items-center px-6 border-b">
                <h2 className="text-xl font-bold text-primary">Menu</h2>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:mt-0 mt-16">
        <div className="container mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
