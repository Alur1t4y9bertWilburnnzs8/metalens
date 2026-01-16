import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Photo } from '../types';

// Fallback images if no album data is passed
const defaultImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBz74-uLlM5PRFceSRgjrRMW3t6eGHFuylpDQ4VATZjiA0eRE_j1n6zJ1xOmlHvLGeyl2uIJZETVbiXIH2Ml8wtUUrb47NGGzn97_EeZR63U1J0RjjBsU9h3_75CLLgPjPmRE7NhD9DtbDRuozjJ1jpL_HJLImDiGdWX61I4szaR6tejdTwSiNq_uDEK-O5I9Z1ACUMO_IsKiCEBzYcPa1TmycSPQ3Ant7P-ufVfYtzvazCP-FBW0KfqKQkXEYrG-Ut1MVO8Qw7pz4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCpw7F_H3Pml9xUEXCcYBWrYLIL3doHHj84rmFlpWjOZADZw5xM--64A-w5572UFjP8pV4fhbCGqAXWwrU2h5hlasXoO_njGgkYZ2j0e9vzW_zEKAgwlXejJsEX58gYrpWZhR34RW-NJPM6d2gJkpXsQMapuyT01Sbu3fguLKs97e3Quv6BBzspHthLfznrKZ4qbp8qX97MUgRPhtGWBALyJ-1Lw5SRnAc-u1snH8zDomXq02NYnX8MidHMd61DzKmOEQjOmUV_1x4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBgnpq_8fNqLbb4Ep_vtS3iZgEEePHo5VTlxeOt-vVmBhivHTYeC-jdzsykn1QUX2buMpAxt5V5euG3Z6jMqIDtdMnBBFj74b6N-U7lAGt77aUsKf8Ggf6nSE8PWebERK0JJdFCUOxgfidmUV7E3I0ZZlk36Z_Ed7NGrDQG1M8sjNfMRxRsye21JYOzb8cdLNor4dmIrtkRTJCerC6qRsnxHbm-4rcUd-4q0hRjxy6WkMYMQXCRi5w4nBZDnslmsN3kgDUjjzrTEJk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB3FxBRr9MNQHpBUJOBX8BrPO-NycZoPy4B19tOu0aRrwbaqjLTKRHfLCjUl_UZHxxIaTJ-KSwLp7yToVWh8vn-WoG05f7O5D-RWYPjSmxd3w7Jlbgye45OKd123x0j2UL020MRIlrkEYn4PKpeIbzsFr4xQ2rYwQ6lCkGHC8MC7gRNBNG4lPa7pfPP3YSMCk-FFlbFPgiQDngbM4NQhXhy-kKCMfA7Af4XIHeSorcbSImch1AsC_eTkS_G8tmIg4Kmm28L6XpHdbY",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDx1nmKOb4tCpgBg0Tua5YmRqvXg69rHt6MjQ01P7GTdbgO0Ixwuh_khxa6VqNBFBS56T8GKp7X5G0jLRW3EBMq2cxw3iQqRyMSVgQZed79WKr6kyLvbKbQwOrUqDFD4UqoH7BXHqa1nWQ1GEA7bCyiLDFZbXKoigu-eXuJTG5LShShFE39Yuw5M43AOYQ1xX6mqvEpjmLNYg5FZ41gyKc7zuiCPJCKzQeWfHlts8FOFHQzfMNurJTw2e1GFL5iiuNK5x0MJrQMmUk",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA8A3OSlgkZZ2HnmPgkuWf9pjdMAO4IIMMEELH9jIGSv5WcT5Tn7g3Lt8y8euWxg54pfwR_NYKIbEQzYWb8aDcmak9sMPhBC_E1LlIV31CJGByGDGqzdOVxLt9MsFlJHHdQJcs2lfyXZ-bolt4JL635OFGFunDkYtU61_F2ula05g7XeUW6uL9jeuKK_IX7xJe3Uzz5nG8E6z2gL7FYQJ60spSroUkEdjUIheSI2L9aYFbv49htItIhzlygOqLnusjSNkFYZHzf4Eg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD487Y59-QOlFj9lMyM5OI_wKW5VCFxiKwMtcvH9mVSWhoPxxz37MiqnjFFwnw7ZNYWkTB4X19lm62na6w0qdJSiAKgeB04mzmLzwYTsfJzeYDoLUDZ01Gj4ROrYz9bCSAFq_XfI89VMFT5fSvwl4402TiAN7z5bSQv5bHCkCzk3KTm780b33ePj7cOBKCTgaYnIcWbWShsbg-oGHdzBOZXrR1QR62QU2MET3VpSPu7IDmprWukAPxftLGwGLvorbxVceKFw5yDWAM"
];

const PosterCollage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const photos = location.state?.photos as Photo[] | undefined;
    const albumTitle = location.state?.albumTitle as string || "Album";
    const albumId = location.state?.albumId as string | undefined;

    const [images, setImages] = useState<string[]>([]);
    const [title, setTitle] = useState(albumTitle);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        let rawImages = photos ? photos.map(p => p.src) : defaultImages;
        if (!rawImages || rawImages.length === 0) rawImages = defaultImages;
        setImages(rawImages);
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

        const element = document.getElementById('poster-content');
        if (element && (window as any).html2canvas) {
            try {
                // Capture the element
                const canvas = await (window as any).html2canvas(element, {
                    useCORS: true,
                    scale: 3, // Higher resolution
                    backgroundColor: '#18181b', // Match bg-zinc-900
                });

                // Create download link
                const link = document.createElement('a');
                link.download = `Metalens-Collage-${title}-${Date.now()}.png`;
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
            // Fallback for dev environment without html2canvas loaded or element missing
            setTimeout(() => {
                setSaveState('saved');
                setTimeout(() => setSaveState('idle'), 2000);
            }, 1500);
        }
    };

    const navigateToStyle = (path: string) => {
        // Push instead of replace to strictly follow history preservation,
        // even though it increases stack depth.
        navigate(path, {
            state: { photos, albumTitle, albumId }
        });
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            {/* Custom Header for Poster Wizard */}
            <header className="sticky top-0 z-50 flex items-center justify-between bg-zinc-900/90 backdrop-blur-md px-4 py-3 border-b border-white/5 mx-auto w-full max-w-md">
                <button
                    onClick={handleBack}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                </button>
                <h2 className="text-lg font-bold leading-tight tracking-tight text-white">策展预览</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white"
                >
                    <span className="material-symbols-outlined text-[24px]">home</span>
                </button>
            </header>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative bg-zinc-900">
                {/* POSTER CONTENT - This is exactly what gets downloaded */}
                <div id="poster-content" className="w-full min-h-full flex flex-col bg-zinc-900 p-0 relative">

                    {/* Featured Image (Large) */}
                    <div className="relative w-full aspect-[4/5] overflow-hidden">
                        <img src={images[0]} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

                        {/* Overlay Title */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2 blend-overlay-text">
                                {title}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">Collection</span>
                                <span className="text-white/80 text-[10px] uppercase tracking-widest font-mono">2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Collage Grid */}
                    <div className="p-4 gap-2 collage-grid">
                        {images.slice(1).map((src, i) => (
                            <div key={i} className="collage-item mb-2 relative group overflow-hidden rounded-sm">
                                <img src={src} alt="" className="w-full h-auto object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-500" crossOrigin="anonymous" />
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-48 pt-10 mt-auto">
                        <div className="flex justify-between items-end border-t border-white/20 pt-4">
                            <div className="text-white/60 text-[9px] uppercase tracking-[0.2em] font-light">
                                Metalens<br />Curated Assets
                            </div>
                            <span className="material-symbols-outlined text-white/40 text-2xl">qr_code_2</span>
                        </div>
                    </div>
                </div>

                {/* Fixed Controls in Container */}
                <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md pointer-events-none p-6 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent pt-20">
                    <div className="flex flex-col gap-6 items-center w-full pointer-events-auto">
                        {/* Style Selector */}
                        <div className="flex items-center p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 shadow-lg gap-1">
                            <button className="px-6 py-1.5 rounded-full bg-white text-black text-xs font-bold shadow-md transition-all">
                                拼贴
                            </button>
                            <button
                                onClick={() => navigateToStyle('/poster/grid')}
                                className="px-6 py-1.5 rounded-full text-white/70 text-xs font-medium hover:text-white transition-all"
                            >
                                网格
                            </button>
                            <button
                                onClick={() => navigateToStyle('/poster/book')}
                                className="px-6 py-1.5 rounded-full text-white/70 text-xs font-medium hover:text-white transition-all"
                            >
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
                                    : 'bg-primary hover:bg-blue-600 text-white'
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
        </div>
    );
};

export default PosterCollage;