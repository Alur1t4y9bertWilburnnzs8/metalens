import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useFavorites } from '../context/FavoritesContext';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams<{ userId: string }>();
    const { getUser, getFollowers, getFollowing, allPublicPosts, currentUser, toggleFollow, isFollowing, updateUser, uploadAvatar } = useData();
    const { isFavorite } = useFavorites();

    const [user, setUser] = useState<any>(null);
    const [followers, setFollowers] = useState<any[]>([]);
    const [following, setFollowing] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isSelf = !userId || userId === currentUser?.id;

    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', bio: '', avatar: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                const profile = await getUser(userId);
                if (profile) {
                    setUser(profile);
                    const [followersList, followingList] = await Promise.all([
                        getFollowers(profile.id),
                        getFollowing(profile.id)
                    ]);
                    setFollowers(followersList);
                    setFollowing(followingList);
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [userId, currentUser]);

    // Sync edit data when entering edit mode or user data loads
    useEffect(() => {
        if (isSelf && user) {
            setEditData({ name: user.name, bio: user.bio, avatar: user.avatar });
        }
    }, [user, isSelf]);

    const publicWorks = user ? allPublicPosts.filter(p => String(p.authorId) === String(user.id)) : [];
    const isFollowed = user ? isFollowing(user.id) : false;


    // --------------------------------------------------------
    // [STRATEGY] Rule 2: Backward Cleanly (For Other Profiles)
    // --------------------------------------------------------
    const handleBack = () => {
        const backUrl = location.state?.backUrl;
        if (backUrl) {
            navigate(backUrl);
        } else {
            // Default fallback for profiles is Community
            navigate('/community');
        }
    };

    // --------------------------------------------------------
    // [STRATEGY] Rule 1: Forward with State
    // --------------------------------------------------------
    const handleFollowersClick = () => {
        if (!user) return;
        navigate(`/user/${user.id}/followers`, {
            state: { backUrl: location.pathname }
        });
    };

    const handleFollowingClick = () => {
        if (!user) return;
        navigate(`/user/${user.id}/following`, {
            state: { backUrl: location.pathname }
        });
    };

    const scrollToWorks = () => {
        document.getElementById('works-grid')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleFollowClick = () => {
        if (!user) return;
        toggleFollow(user.id);
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditData(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        let avatarUrl = editData.avatar;

        if (editData.avatar.startsWith('data:image')) {
            try {
                // Convert base64 to File
                const res = await fetch(editData.avatar);
                const blob = await res.blob();
                const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

                // Upload
                const result = await uploadAvatar(file);
                avatarUrl = result.url;
            } catch (e) {
                console.error("Avatar upload failed:", e);
                alert("头像上传失败，请重试");
                return;
            }
        }

        await updateUser({ ...editData, avatar: avatarUrl });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({ name: user.name, bio: user.bio, avatar: user.avatar });
        setIsEditing(false);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-5 py-4 border-b border-black/5 dark:border-white/5 mx-auto w-full max-w-md">
                {isSelf ? (
                    <>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">个人中心</h2>
                        <div className="w-8"></div>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleBack}
                            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-white cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                        </button>
                        <h2 className="text-base font-bold leading-tight tracking-tight text-slate-900 dark:text-white truncate max-w-[200px]">{user?.name || (loading ? '加载中...' : '未找到用户')}</h2>
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-white cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[24px]">home</span>
                        </button>
                    </>
                )}
            </header>

            <main className="flex-1 px-4 py-6 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
                        <p className="text-sm">正在加载资料...</p>
                    </div>
                ) : !user ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <span className="material-symbols-outlined text-6xl mb-4">person_off</span>
                        <p className="text-sm">未找到该用户</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center mb-8">
                            {/* Avatar Section */}
                            <div className="group relative w-24 h-24 rounded-full overflow-hidden mb-4 shadow-lg border-2 border-white dark:border-surface-dark-hover">
                                <img
                                    src={isEditing ? editData.avatar : (user.avatar || "https://ui-avatars.com/api/?name=" + user.name)}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                                {isEditing && (
                                    <>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-white text-2xl">edit</span>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                        />
                                    </>
                                )}
                            </div>

                            {/* Name Section */}
                            {isEditing ? (
                                <input
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="text-xl font-bold text-center bg-transparent border-b-2 border-primary/50 focus:border-primary outline-none text-slate-900 dark:text-white mb-1 w-full max-w-[200px]"
                                    placeholder="用户名"
                                />
                            ) : (
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h3>
                            )}

                            {/* Bio Section */}
                            {isEditing ? (
                                <textarea
                                    value={editData.bio}
                                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                    className="text-sm text-center bg-slate-100 dark:bg-slate-800 rounded-lg p-2 outline-none text-slate-900 dark:text-white w-full max-w-[80%] resize-none focus:ring-2 focus:ring-primary/50"
                                    placeholder="简介"
                                    rows={2}
                                />
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-text-secondary text-center max-w-[80%]">{user.bio}</p>
                            )}

                            <div className="flex gap-8 mt-6 w-full justify-center">
                                <button onClick={scrollToWorks} className="text-center group">
                                    <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{publicWorks.length}</div>
                                    <div className="text-xs text-slate-500 dark:text-text-secondary uppercase font-medium">作品</div>
                                </button>
                                <button onClick={handleFollowersClick} className="text-center group">
                                    <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{followers.length}</div>
                                    <div className="text-xs text-slate-500 dark:text-text-secondary uppercase font-medium">关注者</div>
                                </button>
                                <button onClick={handleFollowingClick} className="text-center group">
                                    <div className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{following.length}</div>
                                    <div className="text-xs text-slate-500 dark:text-text-secondary uppercase font-medium">关注</div>
                                </button>
                            </div>

                            <div className="w-full mt-6 px-4">
                                {isSelf ? (
                                    isEditing ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={handleCancel}
                                                className="py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="py-2.5 rounded-lg bg-primary text-sm font-bold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20"
                                            >
                                                保存
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full py-2.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            编辑资料
                                        </button>
                                    )
                                ) : (
                                    <div className="flex justify-center w-full">
                                        <button
                                            onClick={handleFollowClick}
                                            className={`w-full py-3 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-[0.98] ${isFollowed
                                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                                                : 'bg-primary text-white hover:bg-blue-600 shadow-primary/20'
                                                }`}
                                        >
                                            {isFollowed ? '已关注' : '关注'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isSelf && !isEditing && (
                            <div className="space-y-1 mb-8 animate-fade-in">
                                <button
                                    // Rule 1: Forward with State
                                    onClick={() => navigate('/favorites', { state: { backUrl: '/profile' } })}
                                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined text-[20px]">favorite</span>
                                        </div>
                                        <span className="text-slate-900 dark:text-white font-medium">我的收藏</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 text-[20px] group-hover:text-primary transition-colors">chevron_right</span>
                                </button>
                                <button
                                    // Rule 1: Forward with State
                                    onClick={() => navigate('/notifications', { state: { backUrl: '/profile' } })}
                                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                                        </div>
                                        <span className="text-slate-900 dark:text-white font-medium">消息通知</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-400 text-[20px] group-hover:text-primary transition-colors">chevron_right</span>
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full mt-2 p-4 rounded-xl border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-center text-sm"
                                >
                                    退出登录
                                </button>
                            </div>
                        )}

                        <div id="works-grid" className="w-full">
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">公开作品 ({publicWorks.length})</h3>
                            </div>

                            {publicWorks.length > 0 ? (
                                <div className="columns-2 gap-3 space-y-3">
                                    {publicWorks.map((item) => {
                                        const liked = isFavorite(item.id);
                                        return (
                                            <div
                                                key={item.id}
                                                className="relative break-inside-avoid overflow-hidden rounded-xl group bg-slate-800 cursor-pointer mb-3"
                                                // Rule 1: Forward with State
                                                onClick={() => navigate(`/image/${item.id}`, {
                                                    state: {
                                                        item: { ...item, liked },
                                                        backUrl: location.pathname // Allow return to this specific profile
                                                    }
                                                })}
                                            >
                                                <img alt={item.title} className={`h-auto w-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.aspect === 'aspect-square' ? 'aspect-square' : ''}`} src={item.src} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <p className="text-xs font-bold text-white truncate">{item.title}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 opacity-50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">image_not_supported</span>
                                    <p className="text-sm">暂无公开作品</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Profile;