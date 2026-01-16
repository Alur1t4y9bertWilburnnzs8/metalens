import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { notifications, userPhotos, allPublicPosts, isFollowing, toggleFollow, loading } = useData();

    const handleBack = () => {
        const backUrl = location.state?.backUrl;
        if (backUrl) {
            navigate(backUrl);
        } else {
            navigate('/profile');
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
                <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">消息通知</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">home</span>
                </button>
            </header>

            <main className="flex-1 px-4 py-2">
                <div className="flex flex-col">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
                            <p className="text-sm">加载中...</p>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map(item => {
                            // Actor info provided by backend
                            const actorId = item.userId;
                            // Search in both userPhotos (private/public) and allPublicPosts (community)
                            const targetPhoto = item.type === 'like'
                                ? (userPhotos.find(p => String(p.id) === item.targetId) || allPublicPosts.find(p => String(p.id) === item.targetId))
                                : null;
                            const followed = actorId ? isFollowing(actorId) : false;

                            return (
                                <div key={item.id} className="flex items-center gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0 animate-fade-in group px-2">
                                    <div
                                        onClick={() => actorId && navigate(`/user/${actorId}`, { state: { backUrl: location.pathname } })}
                                        className="cursor-pointer flex-shrink-0 relative"
                                    >
                                        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                                            {item.actorAvatar ? (
                                                <img src={item.actorAvatar} alt={item.actorName} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-lg">
                                                    {item.actorName?.[0]?.toUpperCase() || '?'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-slate-900 dark:text-white leading-relaxed truncate">
                                            <span
                                                onClick={() => actorId && navigate(`/user/${actorId}`, { state: { backUrl: location.pathname } })}
                                                className="font-bold mr-1.5 cursor-pointer hover:text-primary transition-colors"
                                            >
                                                {item.actorName}
                                            </span>
                                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                                {item.type === 'like' ? '收藏了你的作品' : '开始关注你了'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5 font-medium">{item.timestamp}</div>
                                    </div>

                                    {item.type === 'like' && targetPhoto ? (
                                        <div
                                            onClick={() => navigate(`/image/${targetPhoto.id}`, { state: { backUrl: location.pathname } })}
                                            className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer border border-slate-200 dark:border-white/10 hover:opacity-80 transition-all shadow-sm flex-shrink-0"
                                        >
                                            <img src={targetPhoto.src} className="w-full h-full object-cover" alt="target" />
                                        </div>
                                    ) : item.type === 'like' ? (
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400 border border-slate-200 dark:border-white/10 flex-shrink-0">
                                            失效
                                        </div>
                                    ) : null}

                                    {item.type === 'follow' && actorId && (
                                        <button
                                            onClick={() => toggleFollow(actorId)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 ml-2 flex-shrink-0 whitespace-nowrap ${followed
                                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                                                : 'bg-primary text-white hover:bg-blue-600 shadow-primary/20'
                                                }`}
                                        >
                                            {followed ? '已关注' : '回关'}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">notifications_none</span>
                            <p className="text-base font-medium">暂无新消息</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Notifications;