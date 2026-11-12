export type NotificationCategory = 'all' | 'booking' | 'workout' | 'nutrition';

export interface NotificationItem {
  id: string;
  type: 'booking' | 'workout' | 'nutrition' | 'challenge';
  title: string;
  subtitle: string;
  timeAgo: string;
  isRead: boolean;
  avatarUrl?: string;
  actionText?: string;
}
