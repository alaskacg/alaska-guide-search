import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  Calendar,
  MessageSquare,
  Star,
  CreditCard,
  CheckCircle,
  XCircle,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification, NotificationType } from './useNotifications';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  const iconClass = "h-5 w-5";
  
  switch (type) {
    case 'booking_request':
      return <Calendar className={cn(iconClass, "text-blue-500")} />;
    case 'booking_confirmed':
      return <CheckCircle className={cn(iconClass, "text-green-500")} />;
    case 'booking_cancelled':
      return <XCircle className={cn(iconClass, "text-red-500")} />;
    case 'message':
      return <MessageSquare className={cn(iconClass, "text-purple-500")} />;
    case 'review':
      return <Star className={cn(iconClass, "text-yellow-500")} />;
    case 'payment':
      return <CreditCard className={cn(iconClass, "text-emerald-500")} />;
    default:
      return <Bell className={cn(iconClass, "text-gray-500")} />;
  }
};

export const NotificationItem = ({ notification, onClick }: NotificationItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer transition-colors",
        "hover:bg-accent",
        !notification.read && "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/30"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm font-medium leading-tight",
            !notification.read && "font-semibold"
          )}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="flex-shrink-0 h-2 w-2 bg-blue-500 rounded-full mt-1" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {timeAgo}
        </p>
      </div>
    </div>
  );
};
