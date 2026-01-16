import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

const UserList: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, type } = useParams<{ userId: string; type: string }>();
    const { getFollowers, getFollowing, getUser, currentUser } = useData();

    const [targetUser, setTargetUser] = useState<any>(null);
    const [userList, setUserList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                // 1. Get user info
                const user = await getUser(userId);
                if (user) {
                    setTargetUser(user);
                    // 2. Get list data based on type
                    const list = type === 'followers'
                        ? await getFollowers(user.id)
                        : await getFollowing(user.id);
                    setUserList(list || []);
                }
            } catch (error) {
                console.error('Failed to load user list:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [userId, type]);

    const title = type === 'followers' ? '关注者' : '关注中';

    const handleBack = () => {
        const backUrl = location.state?.backUrl;
        if (backUrl) {
            navigate(backUrl);
        } else {
            if (targetUser?.id === currentUser?.id) {
                navigate('/profile');
            } else if (targetUser) {
                navigate(`/user/${targetUser.id}`);
            } else {
                navigate('/community');
            }
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-3 border-b border-black/5 dark:border-white/5 mx-auto w-full max-w-md">
                <button
                    onClick={handleBack}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back_ios_new</span>
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                        {loading ? '加载中...' : (targetUser?.name || '用户')}
                    </h2>
                    <span className="text-[10px] text-slate-500 font-medium">{title}</span>
                </div>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">home</span>
                </button>
            </header>

            <main className="flex-1 px-4 py-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
                        <p className="text-sm">正在加载...</p>
                    </div>
                ) : userList.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {userList.map(user => (
                            <div
                                key={user.id}
                                onClick={() => navigate(`/user/${user.id}`, {
                                    state: { backUrl: location.pathname }
                                })}
                                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-surface-dark active:bg-slate-50 dark:active:bg-surface-dark-hover transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                                        <img src={user.avatar || "https://ui-avatars.com/api/?name=" + user.username} alt={user.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{user.username}</h3>
                                        <span className="text-xs text-slate-500 dark:text-text-secondary">{user.role}</span>
                                    </div>
                                </div>
                                <button className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                                    查看
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <span className="material-symbols-outlined text-5xl mb-2 text-slate-300">group_off</span>
                        <p className="text-sm">暂无用户</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserList;