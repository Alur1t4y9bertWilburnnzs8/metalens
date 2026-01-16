import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Photo } from '../types';

const defaultImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDpvZCEsucgM8z3a_HIRPXFwavV7_WdA9QQr415ieXtDGHVM1rVPSp_Spri1FcBNCClRMFHsi2ccJeW2wk4Eaa0QytDAt31R0W4o-RmC3yIq7LSUSHe1nI3agsuf7RRZY8cN-FqMrTmodtbyfetSbk3FaKj44ZxnD9T7VHmwAjf0ZHe6RuzeoEE48ePUfWihCNS0mO4vj7VlFA0ZV8Rdvczis3pTMRlrkD1-VmlLifrF0eTYVyl8VQqV7V1INJ3Ecn8svvq3fVemJU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAheXfoNrJTphiGU-62DK-rDlHVKNyr5SOS3FHQo3LkWhRETG6p7T-9Riv6nuNNbq0AbTfVDgWJEy2uPmAzKa2a0_Twte2C758LBwJ65zA-0u8K_BmJKtMyJalsHi5VzzkriW9WNbCUb4BgMSM70wcxllP_Mv7vPDdntzCmp89EK6AcDpEQ48V0sMYK4zKbH98kAce1gtvoVdOS3eURSOwkJ0_GtmVVj_4CbGP0lY_dPtcCihM2ZCFK73SHXlV3YTF7JDe5ee1wqQ0",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCONGbqsszIvHRvGBZiwXk3GZE2bXKFhfvikhaYGTIeLa1xCXvSV_NcyUaIu9M_GwR0vnavnbN2xd3p_FJLcwmOjxpGRYPoIB7ZLcPDGn378ykpYsf_-y7DlbuKF7DJW02YwAEg9tkfheMDU1j9tpGrcE5jEpRz005xLROKAEK7KulPPMwaCM-41BsdlmWbJ4D8VAmEQkLrK0vI9xUvrgfUDoUOsA7HWORr1hg9sGGI31tDV_i4aV5M2S-VMFUNy1zTU3N1QcAIDQg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCMFNm_ErhgAW8J8P9kOgvNny0cuYpnxl1dHIx8sMAueKYL7Xxz259kudwU4Z9QwHJYivpQE3td0l8rOx5xdb0MPkoBwPnkuVHYEpNFvT4SmECg1jGhG-QryOziGqV4Kl9NucGmvivLDxPRZa2BoOGffoBIQB70XOx654losdLAdqxit9ZTNYuDv8A3ji-iLs-9B34CskcwS5Bnyh1mXYJhFeo3o52dlmU2pgVuYbZyIk3NUa44UelJsWbj_ypo_FB4q8njnr4dB-U",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC1oRlXmGzTutESSHmRARwgJWCReBRqvlqRXOc7swfRE_imR58ag74716B2q3jTZGCcK4UT9ScfhVvlgRZtE2fZdektJeH9ryQc5DYEoPlPwfJeMKdnNIZdm2ysonz0ij7XK3FxcimjJUW8Pd6O9QyBvFjvWOHw5MA_dR5qogVVvrqlvCMj970FILap9_HncBlv_2wTtRPTEoP6k_UogaTILwzsX0k07pXma-2BKJG9B9sb29hszVbWs6hOwGNT99Hw4Dfcrh8uNrs",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCbeONzCz7ZSTKD7Yf0Ycw7Jg95-BKrdiRPCvbQfaW17VvWvZE8arYI4HkhJlCedSsK0UZmkgTucS6-T9yEjgtR5kBIhR9yN6unBIXsWHMyFdrfYeNxZZH41OheCBo0oeJLao81p_Gr-UjyByhEsZbGpUDaID1EUJW3YoQx0eYdGanIEOmbBR2So62nxlzcwQ-cm7xnVbLrivxao10DXhYKegAmYUx1couA2Iz6QODw_d3kpd9TarShHnvO9v9spwfOAajzY9o31M4"
];

const PosterBook: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const photos = location.state?.photos as Photo[] | undefined;
    const albumTitle = location.state?.albumTitle as string || "Album";
    const albumId = location.state?.albumId as string | undefined;

    const [images, setImages] = useState<string[]>([]);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        let rawImages = photos ? photos.map(p => p.src) : defaultImages;
        if (!rawImages || rawImages.length === 0) rawImages = defaultImages;
        // Limit total images to ensure good layout, or handle pagination later
        // For now, take up to 8 images for 2 pages (4 per page max)
        setImages(rawImages.slice(0, 8));
    }, [photos]);

    const handleBack = () => {
        // Explicitly return to the album page to escape the poster wizard loop
        if (albumId) {
            navigate(`/album/${albumId}`, {
                state: {
                    album: {
                        id: albumId,
                        title: albumTitle,
                        type: 'photo', // fallback
                        typeLabel: '摄影', // fallback
                        count: photos?.length || 0,
                        cover: ''
                    }
                }
            });
        } else {
            navigate('/library');
        }
    };

    const handleSave = async () => {
        if (saveState !== 'idle') return;
        setSaveState('saving');

        const element = document.getElementById('poster-canvas');
        if (element && (window as any).html2canvas) {
            try {
                const canvas = await (window as any).html2canvas(element, {
                    useCORS: true,
                    scale: 3,
                    backgroundColor: '#1a1a1a', // Capture the dark background
                    logging: false,
                    windowHeight: element.scrollHeight,
                });

                const link = document.createElement('a');
                link.download = `Metalens-Book-${albumTitle.replace(/\s+/g, '-')}-${Date.now()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();

                setSaveState('saved');
                setTimeout(() => setSaveState('idle'), 2000);
            } catch (error) {
                console.error("Capture failed:", error);
                setSaveState('idle');
                alert("保存失败，请重试");
            }
        } else {
            setTimeout(() => {
                setSaveState('saved');
                setTimeout(() => setSaveState('idle'), 2000);
            }, 1500);
        }
    };

    const navigateToStyle = (path: string) => {
        // Push instead of replace
        navigate(path, {
            state: { photos, albumTitle, albumId }
        });
    };

    // Split images
    const splitIndex = Math.ceil(images.length / 2);
    const leftImages = images.slice(0, splitIndex);
    const rightImages = images.slice(splitIndex);

    // Dynamic Page Renderer
    const renderPageContent = (pageImgs: string[], side: 'left' | 'right') => {
        if (pageImgs.length === 0) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-300">
                    <div className="w-16 h-1 bg-gray-300/30 mb-2"></div>
                    <div className="w-10 h-1 bg-gray-300/20"></div>
                </div>
            );
        }

        if (pageImgs.length === 1) {
            return (
                <div className="w-full h-full p-3 flex items-center justify-center">
                    <div className={`relative w-full aspect-[3/4] bg-white p-2 shadow-sm transform transition-transform hover:scale-105 duration-300 ${side === 'left' ? '-rotate-1' : 'rotate-1'}`}>
                        <img src={pageImgs[0]} className="w-full h-full object-cover" alt="" crossOrigin="anonymous" />
                        {/* Tape effect */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 backdrop-blur-sm rotate-2 shadow-sm"></div>
                    </div>
                </div>
            );
        }

        // 2-4 Images: Grid
        return (
            <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 p-2 content-center">
                {pageImgs.map((src, i) => {
                    // Random-ish rotation based on index
                    const rotate = (i + (side === 'left' ? 0 : 1)) % 2 === 0 ? 'rotate-2' : '-rotate-2';
                    const spanClass = (pageImgs.length === 3 && i === 0) ? 'col-span-2 row-span-1 aspect-[2/1]' : 'col-span-1 row-span-1 aspect-square';

                    return (
                        <div key={i} className={`relative bg-white p-1 shadow-sm transform transition-all hover:z-20 hover:scale-110 duration-300 ${rotate} ${spanClass}`}>
                            <img src={src} className="w-full h-full object-cover" alt="" crossOrigin="anonymous" />
                        </div>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-[#1a1a1a] shadow-2xl overflow-x-hidden">
            {/* Header with Back and Home buttons */}
            <header className="sticky top-0 z-[100] flex items-center justify-between bg-[#1a1a1a]/90 backdrop-blur-md px-4 py-3 border-b border-white/5 mx-auto w-full max-w-md">
                <button
                    onClick={handleBack}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition border border-white/10 active:scale-95 shadow-lg group"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                </button>
                <h2 className="text-lg font-bold leading-tight tracking-tight text-white">书页预览</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-white/20 transition border border-white/10 active:scale-95 shadow-lg group"
                >
                    <span className="material-symbols-outlined text-[24px]">home</span>
                </button>
            </header>

            {/* POSTER CANVAS - Full area capture for desk look */}
            <div id="poster-canvas" className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] relative overflow-hidden">
                {/* Dark Wood/Desk Texture Background */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/dark-leather.png")` }}>
                </div>

                {/* Ambient Lighting */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                {/* The Book - Scaled up width */}
                <div className="relative w-[98%] aspect-[1.3/1] bg-[#e3dacd] flex shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] rounded-[2px] overflow-hidden">

                    {/* Left Page */}
                    <div className="flex-1 bg-[#f4f1ea] relative overflow-hidden flex flex-col shadow-[inset_-25px_0_40px_-15px_rgba(0,0,0,0.15)] border-r border-[#dcd5cc]">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60"></div>

                        {/* Page Header */}
                        <div className="pt-4 px-4 flex justify-between items-end relative z-10">
                            <h2 className="font-serif text-lg font-bold text-gray-800 leading-none truncate max-w-[80%]">{albumTitle}</h2>
                            <span className="text-[9px] font-mono text-gray-400">VOL.01</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 relative z-10 p-2">
                            {renderPageContent(leftImages, 'left')}
                        </div>

                        {/* Page Number */}
                        <div className="absolute bottom-2 left-4 text-[9px] font-serif text-gray-400 z-10">
                            - {new Date().getDate()} -
                        </div>
                    </div>

                    {/* Center Spine Crease */}
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 bg-gradient-to-r from-transparent via-black/15 to-transparent pointer-events-none z-30 mix-blend-multiply"></div>

                    {/* Right Page */}
                    <div className="flex-1 bg-[#f4f1ea] relative overflow-hidden flex flex-col shadow-[inset_25px_0_40px_-15px_rgba(0,0,0,0.15)]">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60"></div>

                        {/* Decorative Top */}
                        <div className="pt-5 px-4 flex justify-end relative z-10">
                            <div className="flex gap-1">
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 relative z-10 p-2">
                            {renderPageContent(rightImages, 'right')}
                        </div>

                        {/* Red Bookmark on Right Page */}
                        <div className="absolute -top-2 right-6 w-8 h-24 bg-[#b91c1c] shadow-md z-20 flex items-end justify-center pb-3 transform rotate-0">
                            <span className="text-[10px] font-bold text-white/90 transform -rotate-90 origin-center whitespace-nowrap tracking-widest">COLLECTION</span>
                        </div>

                        {/* Page Number */}
                        <div className="absolute bottom-2 right-4 text-[9px] font-serif text-gray-400 z-10">
                            - {new Date().getDate() + 1} -
                        </div>
                    </div>
                </div>

                {/* Elements around the book (Decor) */}
                <div className="absolute bottom-8 left-8 w-24 h-32 bg-white p-2 shadow-xl transform -rotate-12 z-0 opacity-80">
                    {/* Dummy hidden photo sticking out */}
                </div>
            </div>

            {/* Fixed Controls in Container */}
            <div className="fixed bottom-0 left-0 right-0 z-[110] mx-auto max-w-md pointer-events-none p-6 pb-12 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/80 to-transparent pt-20">
                <div className="flex flex-col gap-6 items-center w-full pointer-events-auto">
                    {/* Style Selector */}
                    <div className="flex items-center p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-lg gap-1">
                        <button
                            onClick={() => navigateToStyle('/poster/collage')}
                            className="px-6 py-1.5 rounded-full text-white/70 text-xs font-medium hover:text-white transition-all"
                        >
                            拼贴
                        </button>
                        <button
                            onClick={() => navigateToStyle('/poster/grid')}
                            className="px-6 py-1.5 rounded-full text-white/70 text-xs font-medium hover:text-white transition-all"
                        >
                            网格
                        </button>
                        <button className="px-6 py-1.5 rounded-full bg-white text-black text-xs font-bold shadow-md transition-all">
                            书页
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 w-full">
                        <button
                            onClick={handleSave}
                            disabled={saveState !== 'idle'}
                            className={`flex-1 h-14 rounded-xl flex items-center justify-center font-bold shadow-xl transition-all active:scale-[0.98] gap-2 ${saveState === 'saved'
                                ? 'bg-green-600 text-white'
                                : 'bg-primary hover:bg-blue-600 text-white shadow-primary/20'
                                }`}
                        >
                            {saveState === 'idle' && (
                                <>
                                    <span className="material-symbols-outlined">download</span>
                                    <span>保存海报</span>
                                </>
                            )}
                            {saveState === 'saving' && (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>正在生成...</span>
                                </>
                            )}
                            {saveState === 'saved' && (
                                <>
                                    <span className="material-symbols-outlined">check</span>
                                    <span>已保存至相册</span>
                                </>
                            )}
                        </button>
                        <button className="w-14 h-14 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-xl rounded-xl flex items-center justify-center transition-all border border-white/10 text-white">
                            <span className="material-icons-round text-2xl">ios_share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosterBook;