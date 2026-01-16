import apiClient from './client';
import { Photo } from '../types';

export interface CreatePhotoData {
    albumId: number;
    url: string;
    thumbnailUrl?: string;
    title?: string;
    isPublic?: boolean;
    width?: number;
    height?: number;
    metadata?: any;
}

/**
 * 创建照片
 */
export const createPhoto = async (data: CreatePhotoData) => {
    const response = await apiClient.post('/photos', data);
    return response.data;
};

/**
 * 获取当前用户的所有照片
 */
export const getPhotos = async (): Promise<Photo[]> => {
    const response = await apiClient.get('/photos');
    return response.data;
};

/**
 * 获取照片详情
 */
export const getPhotoDetail = async (id: string) => {
    const response = await apiClient.get(`/photos/${id}`);
    return response.data;
};

/**
 * 更新照片
 */
export const updatePhoto = async (id: string, data: Partial<CreatePhotoData>) => {
    const response = await apiClient.patch(`/photos/${id}`, data);
    return response.data;
};

/**
 * 切换照片公开状态
 */
export const togglePhotoPrivacy = async (id: string) => {
    const response = await apiClient.post(`/photos/${id}/toggle-privacy`);
    return response.data;
};

/**
 * 删除照片
 */
export const deletePhoto = async (id: string) => {
    const response = await apiClient.delete(`/photos/${id}`);
    return response.data;
};
