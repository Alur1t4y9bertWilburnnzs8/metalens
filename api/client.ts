import axios from 'axios';

/**
 * API 基础配置
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Axios 实例
 */
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * 请求拦截器 - 自动携带 token
 */
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * 响应拦截器 - 统一错误处理
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // 统一错误处理
        if (error.response?.status === 401) {
            // Token 过期或无效，清除本地存储并跳转到登录页
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/#/';
        }

        // 返回错误信息
        const message = error.response?.data?.message || error.message || '请求失败';
        return Promise.reject(new Error(message));
    }
);

export default apiClient;
