import apiClient from './client';
import { CommunityPost } from '../types';

/**
 * 获取社区动态
 */
export const getCommunityFeed = async (page: number = 1, limit: number = 20): Promise<CommunityPost[]> => {
    const response = await apiClient.get('/community/feed', {
        params: { page, limit },
    });
    return response.data;
};

/**
 * 点赞/取消点赞照片
 */
export const toggleLike = async (photoId: number | string) => {
    const response = await apiClient.post(`/community/${photoId}/like`);
    return response.data;
};

/**
 * 获取照片的点赞列表
 */
export const getPhotoLikes = async (photoId: number | string) => {
    const response = await apiClient.get(`/community/${photoId}/likes`);
    return response.data;
};
