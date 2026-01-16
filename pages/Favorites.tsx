import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

const Favorites: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { favorites, toggleFavorite } = useFavorites();

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
                <h2 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">我的收藏</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">home</span>
                </button>
            </header>

            {/* Content */}
            <main className="flex-1 px-4 py-4 pb-10">
                <div className="grid grid-cols-2 gap-4">
                    {favorites.map((item) => (
                        <div
                            key={item.id}
                            // Rule 1: Forward with State
                            onClick={() => navigate(`/image/${item.id}`, {
                                state: {
                                    item: { ...item, liked: true },
                                    backUrl: location.pathname
                                }
                            })}
                            className="group relative flex flex-col gap-2 cursor-pointer break-inside-avoid"
                        >
                            {/* Image Card */}
                            <div className="relative w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 shadow-sm aspect-[3/4]">
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Info Overlay on Hover - Heart Button active */}
                                <div className="absolute top-2 right-2 z-10">
                                    <button
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-red-500"
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(item); }}
                                    >
                                        <span className="material-symbols-outlined text-[16px] icon-filled">favorite</span>
                                    </button>
                                </div>

                                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-xs font-medium text-white truncate max-w-[80%]">{item.title}</span>
                                </div>
                            </div>

                            {/* Author Info Below */}
                            <div className="flex items-center gap-2 px-1">
                                <div className="h-5 w-5 rounded-full overflow-hidden bg-slate-200 ring-1 ring-slate-100 dark:ring-slate-700">
                                    <img src={item.avatar} alt={item.author} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-900 dark:text-slate-200 font-bold truncate leading-none">{item.author}</span>
                                    <span className="text-[9px] text-slate-500 dark:text-slate-400 leading-none mt-0.5">{item.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {favorites.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 text-slate-400 dark:text-slate-600">
                        <span className="material-symbols-outlined text-4xl mb-2">favorite_border</span>
                        <p className="text-sm">暂无收藏的作品</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Favorites;