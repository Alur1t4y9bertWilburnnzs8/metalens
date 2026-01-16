import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useData } from '../context/DataContext';

const filters = ['全部', '摄影', 'AI 艺术', '绘画艺术'];

const Community: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isFavorite, toggleFavorite } = useFavorites();
    const { allPublicPosts, loading } = useData();
    const [activeFilter, setActiveFilter] = useState('全部');

    const filteredItems = allPublicPosts.filter(item =>
        activeFilter === '全部' ? true : item.category === activeFilter
    );

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 mx-auto max-w-md bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-2xl">shutter_speed</span>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Metalens</h1>
                </div>
            </header>
            <main className="flex-1 px-3 pt-20 pb-24 w-full">
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeFilter === filter
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
                        <p className="text-sm">正在加载社区动态...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <span className="material-symbols-outlined text-6xl mb-4">public_off</span>
                        <p className="text-sm">暂无内容，快去发布你的第一张作品吧</p>
                    </div>
                ) : (
                    <div className="columns-2 gap-3 space-y-3">
                        {filteredItems.map((item) => {
                            const liked = isFavorite(item.id);
                            return (
                                <div
                                    key={item.id}
                                    className="relative break-inside-avoid overflow-hidden rounded-xl group bg-slate-800 cursor-pointer mb-3"
                                    // [STRATEGY] Rule 1: Forward with State
                                    onClick={() => navigate(`/image/${item.id}`, {
                                        state: {
                                            item: { ...item, liked },
                                            backUrl: location.pathname // Token: /community
                                        }
                                    })}
                                >
                                    <img alt={item.title} className={`h-auto w-full object-cover transition-transform duration-500 group-hover:scale-110 ${item.aspect === 'aspect-square' ? 'aspect-square' : ''}`} src={item.src} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>

                                    {/* Like Action */}
                                    <div className="absolute top-2 right-2">
                                        <button
                                            className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${liked ? 'bg-white/20 text-red-500' : 'bg-black/30 text-white hover:bg-black/50'}`}
                                            onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                                        >
                                            <span className={`material-symbols-outlined text-[18px] ${liked ? 'icon-filled' : ''}`}>favorite</span>
                                        </button>
                                    </div>

                                    {/* Author & Album Info */}
                                    <div className="absolute bottom-0 left-0 p-3 w-full">
                                        <p className="text-sm font-bold text-white leading-tight">{item.title}</p>
                                        <div className="mt-2 flex items-center justify-between">
                                            <div
                                                className="flex items-center gap-2 opacity-90 hover:opacity-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // [STRATEGY] Rule 1: Forward with State
                                                    navigate(`/user/${(item as any).authorId}`, {
                                                        state: { backUrl: location.pathname }
                                                    });
                                                }}
                                            >
                                                <div className="w-5 h-5 rounded-full bg-slate-400 overflow-hidden ring-1 ring-white/20 flex-shrink-0">
                                                    {item.avatar ? (
                                                        <img src={item.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary flex items-center justify-center text-[8px] text-white">
                                                            {item.author[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-100 leading-none shadow-black drop-shadow-sm">{item.author}</span>
                                                    <span className="text-[9px] text-slate-300 leading-none mt-0.5 scale-95 origin-left">{item.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="flex justify-center mt-8 mb-4">
                    <div className="h-1 w-10 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse"></div>
                </div>
            </main>
        </div>
    );
};

export default Community;