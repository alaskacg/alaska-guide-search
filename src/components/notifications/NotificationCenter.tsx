import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Trash2,
  CheckCheck,
  Filter,
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useNotifications, Notification, NotificationType } from './useNotifications';
import { NotificationItem } from './NotificationItem';

interface NotificationCenterProps {
  userId?: string;
}

type TabType = 'all' | 'unread' | 'bookings' | 'messages';

export const NotificationCenter = ({ userId }: NotificationCenterProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const navigate = useNavigate();
  
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    realtimeEnabled,
  } = useNotifications(userId);

  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];

    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'bookings':
        return notifications.filter(n => 
          n.type === 'booking_request' || 
          n.type === 'booking_confirmed' || 
          n.type === 'booking_cancelled'
        );
      case 'messages':
        return notifications.filter(n => n.type === 'message');
      case 'all':
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.related_type && notification.related_id) {
      switch (notification.related_type) {
        case 'booking':
          navigate(`/bookings/${notification.related_id}`);
          break;
        case 'message':
          navigate(`/messages/${notification.related_id}`);
          break;
        case 'guide':
          navigate(`/guides/${notification.related_id}`);
          break;
        default:
          break;
      }
    }
  };

  const getTabCount = (type: TabType): number => {
    if (!notifications) return 0;
    
    switch (type) {
      case 'unread':
        return notifications.filter(n => !n.read).length;
      case 'bookings':
        return notifications.filter(n => 
          n.type === 'booking_request' || 
          n.type === 'booking_confirmed' || 
          n.type === 'booking_cancelled'
        ).length;
      case 'messages':
        return notifications.filter(n => n.type === 'message').length;
      case 'all':
      default:
        return notifications.length;
    }
  };

  if (!userId) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Card className="p-8 text-center">
          <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            Please log in to view notifications
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Notifications</h1>
            {realtimeEnabled && (
              <Badge variant="outline" className="gap-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear all
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete all notifications?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your notifications. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteAllNotifications()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          Stay updated with your bookings, messages, and activities
        </p>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)}>
          <div className="border-b px-6 pt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="gap-2">
                <Bell className="h-4 w-4" />
                All
                {getTabCount('all') > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getTabCount('all')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="gap-2">
                <Mail className="h-4 w-4" />
                Unread
                {getTabCount('unread') > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {getTabCount('unread')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
                {getTabCount('bookings') > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getTabCount('bookings')}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="messages" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Messages
                {getTabCount('messages') > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {getTabCount('messages')}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-sm text-muted-foreground">Loading notifications...</p>
                  </div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {activeTab === 'unread' 
                      ? "You're all caught up! No unread notifications."
                      : activeTab === 'bookings'
                      ? "No booking notifications yet."
                      : activeTab === 'messages'
                      ? "No message notifications yet."
                      : "You don't have any notifications yet."}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div key={notification.id} className="relative group">
                      <NotificationItem
                        notification={notification}
                        onClick={() => handleNotificationClick(notification)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
