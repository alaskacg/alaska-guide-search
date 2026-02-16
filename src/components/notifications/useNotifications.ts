import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export type NotificationType = 
  | 'booking_request' 
  | 'booking_confirmed' 
  | 'booking_cancelled' 
  | 'message' 
  | 'review' 
  | 'payment';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  created_at: string;
  related_id?: string;
  related_type?: string;
}

export const useNotifications = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [realtimeEnabled, setRealtimeEnabled] = useState(false);

  // Fetch notifications
  const { data: notifications = [], isLoading, error } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
    enabled: !!userId,
  });

  // Get unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread', userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
      console.error('Mark as read error:', error);
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to mark all as read',
        variant: 'destructive',
      });
      console.error('Mark all as read error:', error);
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
      toast({
        title: 'Success',
        description: 'Notification deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
      console.error('Delete notification error:', error);
    },
  });

  // Delete all notifications mutation
  const deleteAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (!userId) return;
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
      toast({
        title: 'Success',
        description: 'All notifications deleted',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete notifications',
        variant: 'destructive',
      });
      console.error('Delete all notifications error:', error);
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification change received:', payload);
          
          // Invalidate queries to refetch
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
          queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });

          // Show toast for new notifications
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeEnabled(true);
          console.log('Subscribed to notifications channel');
        }
      });

    return () => {
      channel.unsubscribe();
      setRealtimeEnabled(false);
    };
  }, [userId, queryClient, toast]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    realtimeEnabled,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    deleteAllNotifications: deleteAllNotificationsMutation.mutate,
    isMarkingAsRead: markAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
};
