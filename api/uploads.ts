import apiClient from './client';

/**
 * 上传图片
 * @param file 文件对象
 * @param data 附加数据 (albumId, title, isPublic, metadata)
 */
export const uploadPhoto = async (file: File, data: { albumId: number; title?: string; isPublic?: boolean; metadata?: any }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('albumId', data.albumId.toString());
    if (data.title) formData.append('title', data.title);
    formData.append('isPublic', data.isPublic ? 'true' : 'false');
    if (data.metadata) {
        formData.append('metadata', JSON.stringify(data.metadata));
    }

    const response = await apiClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // This might be needed to override application/json, but let's try strict approach
        },
    });
    return response.data;
};

/**
 * 上传头像
 * @param file 文件对象
 */
export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    // Expected response: { url: '...' }
    return response.data;
};
