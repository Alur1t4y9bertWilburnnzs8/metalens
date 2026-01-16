import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CreateAlbum: React.FC = () => {
    const navigate = useNavigate();
    const { createAlbum } = useData();
    const [selected, setSelected] = useState<'ai' | 'photo' | 'paint'>('photo');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        navigate(-1);
    };

    const handleCreate = async () => {
        if (!title.trim() || loading) return;

        setLoading(true);
        try {
            // Create the album and get the new object
            const newAlbum = await createAlbum(title, selected);
            // Navigate directly to the new album using REPLACE to skip the form on back
            navigate(`/album/${newAlbum.id}`, {
                state: { album: newAlbum },
                replace: true
            });
        } catch (error) {
            console.error('Failed to create album:', error);
            // Error feedback could be added here
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            <div className="flex items-center justify-between p-4 pt-6 pb-2 mx-auto w-full max-w-md border-b border-black/5 dark:border-white/5 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md sticky top-0 z-50">
                <button onClick={handleBack} className="group flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-slate-900 dark:text-white group-hover:scale-110 transition-transform">arrow_back_ios_new</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">新建相册</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white">home</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col px-6 pb-24 pt-4">
                {/* Album Name Input */}
                <div className="mb-8">
                    <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">相册名称</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="给相册取个名字..."
                        className="w-full bg-transparent border-b-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-2xl font-bold py-2 focus:ring-0 focus:border-primary placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-colors"
                        autoFocus
                    />
                </div>

                <h1 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight text-left pb-4">
                    选择资产类型
                </h1>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setSelected('ai')}
                        className={`group relative flex w-full items-center gap-5 rounded-xl border p-5 transition-all duration-200 focus:outline-none ${selected === 'ai' ? 'border-2 border-primary bg-primary/5 dark:bg-primary/10 shadow-[0_0_20px_rgba(19,91,236,0.15)]' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-transform ${selected === 'ai' ? 'bg-primary text-white scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:scale-105'}`}>
                            <span className={`material-symbols-outlined text-[28px] ${selected === 'ai' ? 'icon-filled' : ''}`}>auto_awesome</span>
                        </div>
                        <div className="text-left flex-1">
                            <div className="flex items-center justify-between w-full">
                                <h3 className={`${selected === 'ai' ? 'text-primary' : 'text-slate-900 dark:text-white'} text-lg font-bold leading-tight tracking-wide`}>AI 艺术</h3>
                                {selected === 'ai' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </div>
                            <p className={`${selected === 'ai' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'} text-xs font-medium pt-1`}>智能生成式创作</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelected('photo')}
                        className={`group relative flex w-full items-center gap-5 rounded-xl border p-5 transition-all duration-200 focus:outline-none ${selected === 'photo' ? 'border-2 border-primary bg-primary/5 dark:bg-primary/10 shadow-[0_0_20px_rgba(19,91,236,0.15)]' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-transform ${selected === 'photo' ? 'bg-primary text-white scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:scale-105'}`}>
                            <span className={`material-symbols-outlined text-[28px] ${selected === 'photo' ? 'icon-filled' : ''}`}>photo_camera</span>
                        </div>
                        <div className="text-left flex-1">
                            <div className="flex items-center justify-between w-full">
                                <h3 className={`${selected === 'photo' ? 'text-primary' : 'text-slate-900 dark:text-white'} text-lg font-bold leading-tight tracking-wide`}>摄影</h3>
                                {selected === 'photo' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </div>
                            <p className={`${selected === 'photo' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'} text-xs font-medium pt-1`}>RAW 原片与胶片扫描</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setSelected('paint')}
                        className={`group relative flex w-full items-center gap-5 rounded-xl border p-5 transition-all duration-200 focus:outline-none ${selected === 'paint' ? 'border-2 border-primary bg-primary/5 dark:bg-primary/10 shadow-[0_0_20px_rgba(19,91,236,0.15)]' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark hover:border-slate-300 dark:hover:border-slate-600'}`}
                    >
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition-transform ${selected === 'paint' ? 'bg-primary text-white scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white group-hover:scale-105'}`}>
                            <span className={`material-symbols-outlined text-[28px] ${selected === 'paint' ? 'icon-filled' : ''}`}>brush</span>
                        </div>
                        <div className="text-left flex-1">
                            <div className="flex items-center justify-between w-full">
                                <h3 className={`${selected === 'paint' ? 'text-primary' : 'text-slate-900 dark:text-white'} text-lg font-bold leading-tight tracking-wide`}>绘画艺术</h3>
                                {selected === 'paint' && <span className="material-symbols-outlined text-primary">check_circle</span>}
                            </div>
                            <p className={`${selected === 'paint' ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'} text-xs font-medium pt-1`}>数字插画与设计</p>
                        </div>
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12 mx-auto max-w-md z-40">
                <button
                    onClick={handleCreate}
                    disabled={!title.trim() || loading}
                    className={`w-full rounded-lg py-4 text-white font-bold text-base tracking-wide shadow-lg transition-colors flex items-center justify-center gap-2 ${(!title.trim() || loading) ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 shadow-primary/20'}`}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>创建中...</span>
                        </div>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[20px]">check</span>
                            <span>创建相册</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CreateAlbum;