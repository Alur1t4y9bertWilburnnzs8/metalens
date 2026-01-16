import apiClient from './client';

export interface SignUpData {
    email: string;
    password: string;
    username: string;
}

export interface LoginData {
    email: string;
    password: string;
}

/**
 * 用户注册
 */
export const signup = async (data: SignUpData) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
};

/**
 * 用户登录
 */
export const login = async (data: LoginData) => {
    const response = await apiClient.post('/auth/login', data);

    // 保存 token 到本地存储
    if (response.data.accessToken) {
        localStorage.setItem('access_token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.profile));
    }

    return response.data;
};

/**
 * 用户登出
 */
export const logout = async () => {
    const response = await apiClient.post('/auth/logout');

    // 清除本地存储
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    return response.data;
};
