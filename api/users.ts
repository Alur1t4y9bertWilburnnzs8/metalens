import apiClient from './client';
import { UserProfile } from '../types';

export interface UpdateProfileData {
    username?: string;
    avatarUrl?: string;
    bio?: string;
    role?: string;
}

/**
 * 获取当前用户资料
 */
export const getMyProfile = async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

/**
 * 更新当前用户资料
 */
export const updateMyProfile = async (data: UpdateProfileData) => {
    const response = await apiClient.patch('/users/me', data);
    return response.data;
};

/**
 * 获取指定用户资料
 */
export const getUserProfile = async (userId: string): Promise<UserProfile> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
};

/**
 * 关注/取消关注用户
 */
export const toggleFollow = async (userId: string) => {
    const response = await apiClient.post(`/users/${userId}/follow`);
    return response.data;
};

/**
 * 获取用户的粉丝列表
 */
export const getUserFollowers = async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/followers`);
    return response.data;
};

/**
 * 获取用户的关注列表
 */
export const getUserFollowing = async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/following`);
    return response.data;
};
