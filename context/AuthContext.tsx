import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, signup as apiSignup, logout as apiLogout, LoginData, SignUpData } from '../api/auth';
import { getMyProfile } from '../api/users';

interface AuthUser {
    id: string;
    username: string;
    avatar: string | null;
    bio: string | null;
    role: string;
}

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    login: (data: LoginData) => Promise<void>;
    signup: (data: SignUpData) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * 初始化：检查本地存储中的用户信息
     */
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    // 验证 token 是否有效，尝试获取最新用户信息
                    const profile = await getMyProfile();
                    setUser({
                        id: profile.id,
                        username: profile.username,
                        avatar: profile.avatarUrl,
                        bio: profile.bio,
                        role: profile.role,
                    });
                } catch (err) {
                    console.error('Init auth failed:', err);
                    // Token 无效，清除本地存储
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    /**
     * 用户登录
     */
    const login = async (data: LoginData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiLogin(data);
            const profile = response.profile;

            setUser({
                id: profile.id,
                username: profile.username,
                avatar: profile.avatarUrl,
                bio: profile.bio,
                role: profile.role,
            });
        } catch (err: any) {
            console.error('Login error detail:', err);
            const message = err.response?.data?.message
                ? `登录失败: ${err.response.data.message}`
                : (err.request ? '登录失败: 无法连接至服务器，请检查后端是否启动' : '登录失败: 密码错误或网络异常');
            setError(message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };

    /**
     * 用户注册
     */
    const signup = async (data: SignUpData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiSignup(data);
            const profile = response.profile;

            // 注册后自动登录
            if (response.session?.access_token) {
                localStorage.setItem('access_token', response.session.access_token);
                localStorage.setItem('user', JSON.stringify(profile));

                setUser({
                    id: profile.id,
                    username: profile.username,
                    avatar: profile.avatarUrl,
                    bio: profile.bio,
                    role: profile.role,
                });
            } else {
                // 如果需要邮箱验证，提示用户
                setError('注册成功！请查收邮件确认您的邮箱后再登录。');
                return;
            }
        } catch (err: any) {
            const message = err.response?.data?.message || '注册失败，请稍后重试';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * 用户登出
     */
    const logout = async () => {
        try {
            await apiLogout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            setUser(null);
            setError(null);
        }
    };

    /**
     * 刷新用户信息
     */
    const refreshUser = async () => {
        if (!user) return;

        try {
            const profile = await getMyProfile();
            setUser({
                id: profile.id,
                username: profile.username,
                avatar: profile.avatarUrl,
                bio: profile.bio,
                role: profile.role,
            });

            // 更新本地存储
            localStorage.setItem('user', JSON.stringify(profile));
        } catch (err) {
            console.error('Failed to refresh user:', err);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                login,
                signup,
                logout,
                isAuthenticated: !!user,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
