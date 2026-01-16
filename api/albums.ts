import apiClient from './client';
import { Album } from '../types';

export interface CreateAlbumData {
    title: string;
    type: 'photo' | 'ai' | 'paint';
}

/**
 * 创建相册
 */
export const createAlbum = async (data: CreateAlbumData) => {
    const response = await apiClient.post('/albums', data);
    return response.data;
};

/**
 * 获取当前用户的相册列表
 */
export const getAlbums = async (): Promise<Album[]> => {
    const response = await apiClient.get('/albums');
    return response.data;
};

/**
 * 获取相册详情
 */
export const getAlbumDetail = async (id: string) => {
    const response = await apiClient.get(`/albums/${id}`);
    return response.data;
};

/**
 * 更新相册
 */
export const updateAlbum = async (id: string, data: Partial<CreateAlbumData>) => {
    const response = await apiClient.patch(`/albums/${id}`, data);
    return response.data;
};

/**
 * 删除相册
 */
export const deleteAlbum = async (id: string) => {
    const response = await apiClient.delete(`/albums/${id}`);
    return response.data;
};
