import apiClient from './client';
import { Notification } from '../types';

/**
 * 获取通知列表
 */
export const getNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications');
    return response.data;
};

/**
 * 获取未读通知数量
 */
export const getUnreadCount = async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
};

/**
 * 标记通知为已读
 */
export const markNotificationAsRead = async (id: string) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
};

/**
 * 标记所有通知为已读
 */
export const markAllNotificationsAsRead = async () => {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
};
