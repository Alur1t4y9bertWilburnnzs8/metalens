import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { CommunityPost } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { useData } from '../context/DataContext';

const ImageDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { allPublicPosts, userPhotos, albums, isFollowing, toggleFollow, currentUser } = useData();

    let initialItem = location.state?.item as CommunityPost | undefined;

    // Fallback data loading
    if (!initialItem && id) {
        const foundPublic = allPublicPosts.find(p => String(p.id) === id);
        if (foundPublic) {
            initialItem = foundPublic;
        } else {
            const foundPhoto = userPhotos.find(p => String(p.id) === id);
            if (foundPhoto) {
                // ... setup from userPhotos
                const album = albums.find(a => a.id === foundPhoto.albumId);
                initialItem = {
                    id: foundPhoto.id,
                    title: foundPhoto.title,
                    author: currentUser?.name || '我',
                    authorId: currentUser?.id || '',
                    avatar: currentUser?.avatar,
                    album: album?.title || '我的相册',
                    category: (album?.typeLabel as any) || '摄影',
                    src: foundPhoto.src,
                    aspect: 'aspect-auto',
                    liked: false,
                    likesCount: 0,
                    isUserPost: true,
                    meta: foundPhoto.meta
                };
            }
        }
    }

    // New State for remote fetch
    const [remoteItem, setRemoteItem] = React.useState<CommunityPost | null>(null);

    React.useEffect(() => {
        const loadRemote = async () => {
            if ((!initialItem || initialItem.author === 'Jane Doe') && id) {
                try {
                    const { data: photo } = await import('../api/client').then(m => m.apiClient.get(`/photos/${id}`));

                    // Helper to Map API response to CommunityPost
                    const mapped: CommunityPost = {
                        id: photo.id,
                        title: photo.title || '无标题',
                        author: photo.profile?.username || '未知作者',
                        authorId: photo.profile?.id || '',
                        avatar: photo.profile?.avatarUrl,
                        album: photo.album?.title || '相册',
                        category: '摄影',
                        src: photo.url,
                        aspect: photo.width && photo.height ? (photo.width > photo.height ? 'aspect-video' : 'aspect-[3/4]') : 'aspect-square',
                        liked: photo.likedBy?.some((u: any) => u.id === currentUser?.id) || false, // Check if current user liked it
                        likesCount: photo.likesCount || 0,
                        isUserPost: photo.profileId === currentUser?.id,
                        meta: photo.metadata
                    };
                    setRemoteItem(mapped);
                } catch (e) {
                    console.error('Failed to load remote photo:', e);
                }
            }
        }
        loadRemote();
    }, [id, initialItem, currentUser]);

    // Use remote item if available, otherwise initialItem
    const activeItem = remoteItem || initialItem;

    if (!activeItem) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-background-light dark:bg-background-dark text-slate-500 gap-6 p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p>正在加载...</p>
                <button
                    onClick={() => navigate('/community')}
                    className="mt-4 flex items-center gap-2 px-6 py-2 rounded-full bg-slate-200 dark:bg-slate-800 text-sm"
                >
                    返回首页
                </button>
            </div>
        );
    }

    const liked = isFavorite(activeItem.id);
    const initialLikes = activeItem.likesCount || 0;
    const initialLikedState = activeItem.liked || false;
    let displayLikes = initialLikes;
    if (liked && !initialLikedState) displayLikes = initialLikes + 1;
    else if (!liked && initialLikedState) displayLikes = Math.max(0, initialLikes - 1);

    const isCurrentUser = activeItem.authorId === currentUser?.id;
    const isFollowed = isFollowing(activeItem.authorId);

    // --------------------------------------------------------
    // [STRATEGY] Rule 1: Forward with State
    // --------------------------------------------------------
    const handleAuthorClick = () => {
        if (isCurrentUser) {
            navigate('/profile');
        } else {
            navigate(`/user/${activeItem.authorId}`, {
                state: { backUrl: location.pathname } // Pass current image path as token
            });
        }
    };

    // --------------------------------------------------------
    // [STRATEGY] Rule 2: Backward Cleanly
    // --------------------------------------------------------
    const handleBack = () => {
        const backUrl = location.state?.backUrl;

        if (backUrl) {
            // Clean navigation, dropping the previous state to break potential loops
            navigate(backUrl);
        } else {
            // Fallback strategy if page was loaded directly or state lost
            if (activeItem?.isUserPost) {
                navigate('/library');
            } else {
                navigate('/community');
            }
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl pb-20 overflow-x-hidden">
            <div className="fixed top-4 left-0 right-0 z-50 pointer-events-none mx-auto max-w-md px-4">
                <div className="flex justify-between w-full">
                    <button
                        onClick={handleBack}
                        className="flex w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors text-white shadow-lg cursor-pointer pointer-events-auto"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                    </button>

                    <button
                        onClick={() => navigate('/profile')}
                        className="flex w-10 h-10 items-center justify-center rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 transition-colors text-white shadow-lg cursor-pointer pointer-events-auto"
                    >
                        <span className="material-symbols-outlined text-[24px]">home</span>
                    </button>
                </div>
            </div>

            <div className="w-full bg-black min-h-[50vh]">
                <img src={activeItem.src} alt={activeItem.title} className="w-full h-auto max-h-[75vh] object-contain mx-auto shadow-2xl" />
            </div>

            <div className="relative -mt-6 rounded-t-3xl bg-background-light dark:bg-background-dark px-6 pt-8 pb-10 shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-colors z-10">
                <div className="mx-auto w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-6"></div>

                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">{activeItem.title}</h1>
                        <div className="flex items-center gap-2 text-xs font-medium">
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                {activeItem.category}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-500 dark:text-slate-400">{activeItem.album}</span>
                        </div>
                    </div>
                    <button
                        className="flex flex-col items-center gap-1 group"
                        onClick={() => toggleFavorite(activeItem!.id)}
                    >
                        <div className={`p-3 rounded-full transition-colors ${liked ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                            <span className={`material-symbols-outlined text-[24px] ${liked ? 'icon-filled' : ''}`}>favorite</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{displayLikes}</span>
                    </button>
                </div>

                {!isCurrentUser && (
                    <div
                        className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-white/5 shadow-sm mb-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-surface-dark-hover transition-colors"
                        onClick={handleAuthorClick}
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white dark:ring-surface-dark-hover">
                                <img src={activeItem.avatar || ''} alt={activeItem.author} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">{activeItem.author}</span>
                                <span className="text-[10px] text-slate-500 dark:text-text-secondary">2天前发布</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleFollow(activeItem!.authorId); }}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isFollowed
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                }`}
                        >
                            {isFollowed ? '已关注' : '关注'}
                        </button>
                    </div>
                )}

                {/* Meta data section simplified for brevity but functional */}
                {/* Meta data section */}
                {activeItem.meta && (Object.keys(activeItem.meta).length > 0) && (
                    <div className="bg-slate-50 dark:bg-[#161b26] rounded-xl p-4 border border-slate-200 dark:border-white/5 space-y-4">
                        {(activeItem.meta.camera || activeItem.meta.model || activeItem.meta.tool) && (
                            <div className="grid grid-cols-2 gap-4">
                                {activeItem.meta.camera && (
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Device</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{activeItem.meta.camera}</p>
                                    </div>
                                )}
                                {activeItem.meta.model && (
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Model</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{activeItem.meta.model}</p>
                                    </div>
                                )}
                                {activeItem.meta.tool && (
                                    <div>
                                        <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Tool</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{activeItem.meta.tool}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeItem.meta.params && (
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Settings</p>
                                <p className="text-sm font-mono text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-800/50 px-2 py-1 rounded inline-block">
                                    {activeItem.meta.params}
                                </p>
                            </div>
                        )}

                        {activeItem.meta.prompt && (
                            <div>
                                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-1">Prompt</p>
                                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-mono break-words bg-slate-100 dark:bg-black/20 p-3 rounded-lg border border-slate-200 dark:border-white/5">
                                    {activeItem.meta.prompt}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageDetail;