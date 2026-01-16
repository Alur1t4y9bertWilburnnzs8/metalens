import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Album, Photo } from '../types';
import { useData } from '../context/DataContext';

const AlbumDetail: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getPhotosByAlbum, togglePhotoPrivacy, deletePhoto } = useData();

    // Retrieve album from navigation state
    const albumState = location.state?.album as Album | undefined;
    const albumId = albumState?.id || '1';
    const albumTitle = albumState?.title || '相册';
    const albumType = albumState?.type || 'photo';

    const photos = getPhotosByAlbum(albumId);

    // --------------------------------------------------------
    // [STRATEGY] Explicit Navigation - Fixed Parent
    // --------------------------------------------------------
    const handleBack = () => {
        // Rule: Albums always belong to the Library. 
        // We do not rely on history stack here to prevent looping.
        navigate('/library');
    };

    const togglePublic = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        togglePhotoPrivacy(id);
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        deletePhoto(id);
    };

    const handleGeneratePoster = () => {
        // Forwarding to Poster does not require backUrl logic as Poster uses strict -1 pop
        navigate('/poster/collage', {
            state: {
                photos: photos,
                albumTitle: albumTitle,
                albumId: albumId
            }
        });
    };

    const handlePhotoClick = (photo: Photo) => {
        const postItem: any = {
            id: photo.id,
            title: photo.title || '未命名作品',
            author: 'Jane Doe',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeepAafFtbS1MrRysh7GxyoIdL9GubTROAfxSpqZXhqxUeb5D1Tl7gfuf-12HIGcemhRCz0qPbDnb6WvdVBNWOf7Vz0SIYcVcD7HkjanQYCtYQFS0eoe9NN-v4sK7PfJbTQTwda04rBcrEnFOd2z0faYQgzB6S3FzMu0NkSwjStJ2Qm0aJCkGIVwdOlppBOGqRxMiIXiOE0PE4iFNjqf_XOUmC2BaIuA7Kg_O4mdD3P9sjVfQ__7K1hbKqQ7h56hT8pl-satSjGuI',
            album: albumTitle,
            category: albumType === 'ai' ? 'AI 艺术' : albumType === 'paint' ? '插画' : '摄影',
            src: photo.src,
            aspect: 'aspect-auto',
            liked: false,
            meta: photo.meta
        };

        // [STRATEGY] Rule 1: Forward with State (Pass the token)
        navigate(`/image/${photo.id}`, {
            state: {
                item: postItem,
                backUrl: location.pathname // Token: /album/:id
            }
        });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 mx-auto w-full max-w-md">
                <div className="flex items-center justify-between px-4 h-14">
                    <button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-white cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                    </button>
                    <div className="flex-1 text-center mx-2 truncate">
                        <h1 className="text-base font-semibold leading-tight tracking-tight text-slate-900 dark:text-white tracking-tight">{albumTitle}</h1>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-white cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[24px]">home</span>
                    </button>
                </div>
            </header>
            <main className="flex-1 flex flex-col w-full">
                <div className="pt-2 pb-2 px-4 text-center">
                    <p className="text-slate-500 dark:text-[#9da6b9] text-xs font-medium uppercase tracking-wide">
                        {photos.length} 个资源 • 相关资料
                    </p>
                </div>

                {photos.length > 0 && (
                    <div className="px-4 pb-4">
                        <button
                            onClick={handleGeneratePoster}
                            className="group relative w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-medium text-sm transition-all active:scale-[0.98] overflow-hidden shadow-[0_0_20px_rgba(19,91,236,0.3)] hover:shadow-[0_0_25px_rgba(19,91,236,0.5)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                            <span>一键策展</span>
                        </button>
                    </div>
                )}

                <div className="px-4 pb-32">
                    {photos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <span className="material-symbols-outlined text-6xl mb-4 text-slate-300 dark:text-slate-600">image</span>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">相册还是空的</p>
                            <p className="text-xs text-slate-500">点击右下角按钮添加图片</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {photos.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => handlePhotoClick(item)}
                                    className="relative group rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 transition-all aspect-[3/4] cursor-pointer"
                                >
                                    <img alt="" className={`w-full h-full object-cover ${item.isPublic ? 'opacity-100' : 'opacity-60 grayscale-[50%]'} transition-all duration-300`} src={item.src} />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="absolute top-2 left-2 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border border-white/10 bg-black/20 text-white/70 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-90 z-50 cursor-pointer shadow-sm"
                                        title="删除照片"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                    </button>

                                    <button
                                        onClick={(e) => togglePublic(item.id, e)}
                                        className={`absolute top-2 right-2 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-all active:scale-90 z-50 cursor-pointer shadow-sm ${item.isPublic ? 'bg-primary/90 border-primary text-white shadow-[0_0_12px_rgba(19,91,236,0.6)]' : 'bg-black/30 border-white/20 text-white/50 hover:bg-black/50 hover:text-white'}`}
                                    >
                                        <span className={`material-symbols-outlined text-[20px] ${item.isPublic ? 'icon-filled' : ''}`}>bolt</span>
                                    </button>

                                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm z-20">
                                        <span className="text-[10px] font-medium text-white/90">
                                            {item.isPublic ? '已公开' : '私有'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <div className="fixed bottom-24 left-0 right-0 z-40 px-6 mx-auto max-w-md pointer-events-none">
                <div className="flex justify-end w-full">
                    <button
                        onClick={() => navigate('/upload', { state: { type: albumType, albumId: albumId } })}
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-[0_4px_14px_0_rgba(19,91,236,0.39)] hover:shadow-[0_6px_20px_rgba(19,91,236,0.23)] hover:scale-105 transition-all active:scale-95 pointer-events-auto"
                    >
                        <span className="material-symbols-outlined text-[28px]">add_photo_alternate</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlbumDetail;