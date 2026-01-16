import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Library: React.FC = () => {
    const navigate = useNavigate();
    const { albums, loading, deleteAlbum } = useData();

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            <header className="sticky top-0 z-40 flex items-center justify-between bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-5 py-4 border-b border-black/5 dark:border-white/5 mx-auto w-full max-w-md">
                <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">个人库</h2>
                <div className="w-8"></div>
            </header>
            <main className="flex-1 px-4 py-6 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
                        <p className="text-sm">正在加载相册...</p>
                    </div>
                ) : albums.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <span className="material-symbols-outlined text-6xl mb-4">folder_open</span>
                        <p className="text-sm">暂无相册，点击下方按钮新建</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                className="group flex flex-col gap-2 cursor-pointer relative"
                                onClick={() => navigate(`/album/${album.id}`, { state: { album } })}
                            >
                                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-800 shadow-md">
                                    {album.cover ? (
                                        <>
                                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${album.cover}")` }}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                            <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-4xl">image</span>
                                        </div>
                                    )}

                                    {/* Delete Album Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('确定要删除这个相册吗？相册内的照片也将被移除。')) {
                                                deleteAlbum(album.id);
                                            }
                                        }}
                                        className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:bg-red-500 hover:text-white transition-all z-20 shadow-sm"
                                        title="删除相册"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{album.title}</h3>
                                    </div>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${album.color === 'primary' ? 'border-primary/30 bg-primary/10 text-primary' : 'border-gray-200 dark:border-gray-700 bg-transparent text-gray-500 dark:text-gray-400'}`}>
                                            {album.typeLabel}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{album.count} 张</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Fixed New Album Button - Corrected Positioning */}
            <div className="fixed bottom-[88px] left-0 right-0 z-30 px-4 mx-auto max-w-md pointer-events-none">
                <div className="flex justify-end w-full">
                    <button
                        onClick={() => navigate('/create')}
                        className="pointer-events-auto shadow-lg shadow-primary/30 flex h-14 items-center justify-center gap-2 rounded-xl bg-primary pl-4 pr-6 text-white transition-transform active:scale-95 hover:bg-primary/90"
                    >
                        <span className="material-symbols-outlined text-[24px]">add</span>
                        <span className="text-base font-bold tracking-wide">新建相册</span>
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Library;