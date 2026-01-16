import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

const UploadDetails: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { uploadPhoto, albums } = useData();

    // Default to 'photo' if state is missing
    const type = location.state?.type || 'photo';
    const albumId = location.state?.albumId; // Get target album ID

    const [isPublic, setIsPublic] = useState(false);
    const [title, setTitle] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getTitle = () => {
        if (type === 'ai') return 'AI 艺术';
        if (type === 'paint') return '绘画艺术';
        return '摄影';
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const [isUploading, setIsUploading] = useState(false);
    const [metaModel, setMetaModel] = useState('');
    const [metaPrompt, setMetaPrompt] = useState('');
    const [metaTool, setMetaTool] = useState('');
    const [cameraBrand, setCameraBrand] = useState('');
    const [aperture, setAperture] = useState('');
    const [shutter, setShutter] = useState('');
    const [iso, setIso] = useState('');

    const handleUpload = async () => {
        if (!selectedFile || isUploading) return;

        setIsUploading(true);
        try {
            // Determine the numeric album ID
            const numericAlbumId = albumId ? Number(albumId) : 1;

            // Create payload for metadata
            const metadata = {
                camera: cameraBrand || (type === 'photo' ? 'Sony A7III' : undefined),
                params: `${aperture ? 'f/' + aperture : ''} ${shutter} ${iso ? 'ISO' + iso : ''}`.trim() || (type === 'photo' ? '35mm f/1.8' : undefined),
                model: metaModel || (type === 'ai' ? 'Midjourney v6' : undefined),
                prompt: metaPrompt,
                tool: metaTool || (type === 'paint' ? 'Procreate' : undefined),
            };

            await uploadPhoto(selectedFile, {
                albumId: numericAlbumId,
                title: title || '未命名作品',
                isPublic: isPublic,
                metadata: metadata
            });

            // Navigate back after success
            navigate(-1);
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert(`上传失败: ${error?.response?.data?.message || error.message || '未知错误'}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden selection:bg-primary/30 selection:text-white">
            <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 mx-auto w-full max-w-md">
                <button onClick={handleBack} className="group flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-gray-900 dark:text-white group-hover:scale-110 transition-transform">arrow_back_ios_new</span>
                </button>
                <h1 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight">上传 • {getTitle()}</h1>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group"
                >
                    <span className="material-symbols-outlined text-gray-500 dark:text-[#9da6b9] group-hover:text-primary transition-colors">home</span>
                </button>
            </header>
            <main className="flex-1 flex flex-col w-full max-w-lg mx-auto pb-28">
                <div className="@container px-4 py-4 w-full">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-[#1c2333] aspect-[4/3] group cursor-pointer border-2 border-dashed border-slate-600 hover:border-primary transition-colors flex flex-col items-center justify-center"
                    >
                        {previewUrl ? (
                            <>
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${previewUrl}")` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent opacity-80"></div>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-outlined text-white text-4xl">edit</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-primary transition-colors animate-fade-in">
                                <span className="material-symbols-outlined text-5xl">add_photo_alternate</span>
                                <span className="text-sm font-bold tracking-wide">点击上传照片</span>
                            </div>
                        )}

                        {/* Hidden Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />

                        {previewUrl && type === 'photo' && (
                            <div className="absolute bottom-4 left-4">
                                <span className="px-2 py-1 rounded bg-primary/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                                    RAW • 48MP
                                </span>
                            </div>
                        )}
                        {previewUrl && type === 'ai' && (
                            <div className="absolute bottom-4 left-4">
                                <span className="px-2 py-1 rounded bg-purple-600/90 text-white text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm">
                                    AI Generated
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-6 px-4 pt-2">
                    <div className="group/input">
                        <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1 ml-1 group-focus-within/input:text-primary transition-colors">作品名称 (选填)</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-2xl font-semibold placeholder:text-gray-400 dark:placeholder:text-gray-600 px-1 py-2 focus:ring-0 focus:border-primary transition-all rounded-t-lg hover:bg-gray-50 dark:hover:bg-white/5 focus:bg-gray-100 dark:focus:bg-white/5"
                            placeholder="未命名作品"
                            type="text"
                        />
                    </div>

                    {/* Dynamic Fields for Photography */}
                    {type === 'photo' && (
                        <>
                            <div className="group/select relative">
                                <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">相机品牌 (选填)</label>
                                <div className="relative">
                                    <select
                                        value={cameraBrand}
                                        onChange={(e) => setCameraBrand(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-surface-dark border-none rounded-lg text-gray-900 dark:text-white text-base py-4 pl-12 pr-10 focus:ring-2 focus:ring-primary shadow-sm hover:cursor-pointer transition-shadow"
                                    >
                                        <option value="">未选择</option>
                                        <option value="Sony">Sony Alpha</option>
                                        <option value="Canon">Canon EOS</option>
                                        <option value="Nikon">Nikon Z</option>
                                        <option value="Fujifilm">Fujifilm X</option>
                                        <option value="Leica">Leica</option>
                                        <option value="iPhone">iPhone</option>
                                    </select>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                                        <span className="material-symbols-outlined">photo_camera</span>
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white text-sm font-bold uppercase tracking-wide mb-3 pl-1 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-primary">analytics</span>
                                    拍摄参数 (选填)
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white dark:bg-surface-dark rounded-lg p-3 flex flex-col items-center justify-center gap-1 shadow-sm border border-gray-100 dark:border-white/5 cursor-text">
                                        <label className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-widest">光圈</label>
                                        <div className="flex items-center text-gray-900 dark:text-white">
                                            <span className="text-xs mr-0.5 opacity-50 font-serif italic">f/</span>
                                            <input
                                                value={aperture}
                                                onChange={(e) => setAperture(e.target.value)}
                                                className="w-12 bg-transparent border-none p-0 text-center font-mono text-base font-bold focus:ring-0 placeholder:text-gray-400" type="text" placeholder="-"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-surface-dark rounded-lg p-3 flex flex-col items-center justify-center gap-1 shadow-sm border border-gray-100 dark:border-white/5 cursor-text">
                                        <label className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-widest">快门</label>
                                        <div className="flex items-center text-gray-900 dark:text-white">
                                            <input
                                                value={shutter}
                                                onChange={(e) => setShutter(e.target.value)}
                                                className="w-16 bg-transparent border-none p-0 text-center font-mono text-base font-bold focus:ring-0 placeholder:text-gray-400" type="text" placeholder="-"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-surface-dark rounded-lg p-3 flex flex-col items-center justify-center gap-1 shadow-sm border border-gray-100 dark:border-white/5 cursor-text">
                                        <label className="text-gray-400 dark:text-gray-500 text-[10px] uppercase font-bold tracking-widest">ISO</label>
                                        <div className="flex items-center text-gray-900 dark:text-white">
                                            <input
                                                value={iso}
                                                onChange={(e) => setIso(e.target.value)}
                                                className="w-12 bg-transparent border-none p-0 text-center font-mono text-base font-bold focus:ring-0 placeholder:text-gray-400" type="text" placeholder="-"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Dynamic Fields for AI Art */}
                    {type === 'ai' && (
                        <>
                            <div className="group/input">
                                <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">AI 模型 (Model) (选填)</label>
                                <div className="relative">
                                    <input
                                        value={metaModel}
                                        onChange={(e) => setMetaModel(e.target.value)}
                                        className="block w-full rounded-lg border-0 py-3.5 px-4 pl-12 text-slate-900 ring-1 ring-inset ring-slate-200 dark:bg-surface-dark dark:text-white dark:ring-border-dark focus:ring-2 focus:ring-primary sm:text-sm shadow-sm" placeholder="例如: Midjourney v6" type="text"
                                    />
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                                        <span className="material-symbols-outlined">smart_toy</span>
                                    </div>
                                </div>
                            </div>
                            <div className="group/input">
                                <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">提示词 (Prompt) (选填)</label>
                                <textarea
                                    value={metaPrompt}
                                    onChange={(e) => setMetaPrompt(e.target.value)}
                                    className="w-full bg-white dark:bg-surface-dark border-none rounded-lg text-gray-900 dark:text-white text-sm p-4 h-28 focus:ring-2 focus:ring-primary resize-none placeholder:text-gray-400 dark:placeholder:text-gray-600 shadow-sm leading-relaxed font-mono" placeholder="输入生成该图片的 Prompt..."
                                ></textarea>
                            </div>
                        </>
                    )}

                    {/* Dynamic Fields for Digital Art */}
                    {type === 'paint' && (
                        <div className="group/input">
                            <label className="block text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 ml-1">创作工具 (Tool) (选填)</label>
                            <div className="relative">
                                <input
                                    value={metaTool}
                                    onChange={(e) => setMetaTool(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-3.5 px-4 pl-12 text-slate-900 ring-1 ring-inset ring-slate-200 dark:bg-surface-dark dark:text-white dark:ring-border-dark focus:ring-2 focus:ring-primary sm:text-sm shadow-sm" placeholder="例如: Procreate, Photoshop, 画笔" type="text"
                                />
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                                    <span className="material-symbols-outlined">brush</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Public Toggle - Global for all types */}
                    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-surface-dark dark:to-[#161b26] rounded-xl p-4 border border-gray-200 dark:border-white/5 shadow-sm mt-2 cursor-pointer" onClick={() => setIsPublic(!isPublic)}>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-[22px] transition-colors ${isPublic ? 'icon-filled text-primary' : 'text-gray-400'}`}>bolt</span>
                                    <h3 className="text-gray-900 dark:text-white text-base font-bold">点亮 (公开)</h3>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed max-w-[220px]">
                                    {isPublic ? '作品将展示在社区动态流中，所有人可见。' : '当前为私有状态，仅自己可见。'}
                                </p>
                            </div>
                            <div className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${isPublic ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}>
                                <div className={`absolute top-[2px] left-[2px] w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ${isPublic ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 z-40 mx-auto max-w-md">
                <div className="w-full">
                    <button
                        onClick={handleUpload}
                        disabled={!previewUrl || isUploading}
                        className={`w-full group relative overflow-hidden bg-primary hover:bg-blue-600 text-white font-bold text-base py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 ${(!previewUrl || isUploading) ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70' : ''}`}
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
                        {isUploading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span>上传中...</span>
                            </div>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">cloud_upload</span>
                                <span>完成上传</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadDetails;