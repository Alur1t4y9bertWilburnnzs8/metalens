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

const PosterGrid: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const photos = location.state?.photos as Photo[] | undefined;
    const albumTitle = location.state?.albumTitle as string || "Album";
    const albumId = location.state?.albumId as string | undefined;

    const [images, setImages] = useState<string[]>([]);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');

    useEffect(() => {
        let rawImages = photos ? photos.map(p => p.src) : defaultImages;
        if (rawImages.length === 0) rawImages = defaultImages;
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

        // Target the specific poster canvas, NOT the entire page
        const element = document.getElementById('poster-canvas');
        if (element && (window as any).html2canvas) {
            try {
                // Adjust height temporarily to ensure full capture if needed, 
                // though html2canvas usually handles scrollable children well.
                const canvas = await (window as any).html2canvas(element, {
                    useCORS: true,
                    scale: 3, // High resolution for poster printing
                    backgroundColor: null, // Transparent to handle CSS backgrounds correctly
                    logging: false,
                    windowHeight: element.scrollHeight + 100, // Ensure full height is captured
                });

                // Create download link
                const link = document.createElement('a');
                link.download = `Metalens-Poster-${albumTitle.replace(/\s+/g, '-')}-${Date.now()}.png`;
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
            // Fallback
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

    return (
        <div className="relative flex min-h-screen w-full flex-col mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-x-hidden">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-white dark:bg-black px-4 py-3 border-b border-black/5 dark:border-white/5 mx-auto w-full max-w-md">
                <button
                    onClick={handleBack}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-black dark:text-white"
                >
                    <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
                </button>
                <h2 className="text-lg font-bold leading-tight tracking-tight text-black dark:text-white">海报生成</h2>
                <button
                    onClick={() => navigate('/profile')}
                    className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-black dark:text-white"
                >
                    <span className="material-symbols-outlined text-[24px]">home</span>
                </button>
            </header>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative bg-white dark:bg-zinc-950 pt-0">

                {/* POSTER CANVAS - This is exactly what gets downloaded */}
                <div id="poster-canvas" className="w-full min-h-full flex flex-col bg-white dark:bg-zinc-950 p-6 pt-24 pb-12 box-border">

                    {/* Poster Header */}
                    <div className="flex flex-col gap-2 mb-6 border-b-2 border-black dark:border-white pb-4">
                        <div className="flex justify-between items-end">
                            <h1 className="text-3xl font-black uppercase leading-none tracking-tighter text-black dark:text-white max-w-[75%] break-words">
                                {albumTitle}
                            </h1>
                            {/* VOL box removed as requested */}
                        </div>
                        <div className="flex justify-between text-[8px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mt-1">
                            <span>GRID COLLECTION</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {photos.slice(0, 4).map((photo, index) => (
                            <div key={photo.id} className={`aspect-square relative overflow-hidden bg-gray-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 ${index === 1 || index === 2 ? 'translate-y-4' : ''}`}>
                                <img src={photo.src} alt="" className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 size-4 flex items-center justify-center rounded-full bg-black dark:bg-white text-white dark:text-black text-[8px] font-bold">
                                    {(index + 1).toString().padStart(2, '0')}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Poster Footer */}
                    <div className="mt-auto pt-8 border-t border-black/10 dark:border-white/10 flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <div className="text-[10px] font-bold tracking-widest text-black dark:text-white">METALENS STUDIO</div>
                            <span className="text-[8px] text-gray-500 dark:text-gray-400 font-mono">Generated via Metalens App</span>
                        </div>
                        {/* Aesthetic Barcode */}
                        <div className="flex gap-0.5 h-5 items-end opacity-80 mix-blend-difference">
                            {[...Array(28)].map((_, i) => (
                                <div key={i} className={`bg-black dark:bg-white w-[1.5px] ${Math.random() > 0.4 ? 'h-full' : Math.random() > 0.5 ? 'h-2/3' : 'h-1/3'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* End of Preview Marker - Outside capture area */}
                <div className="pb-40 text-center opacity-0 pointer-events-none h-10">
                    Space for buttons
                </div>
            </div>

            {/* Fixed Controls in Container */}
            <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md pointer-events-none p-6 pb-12 bg-gradient-to-t from-background-light via-background-light/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent pt-20">
                <div className="flex flex-col gap-6 items-center w-full pointer-events-auto">
                    {/* Style Selector */}
                    <div className="flex items-center p-1 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 shadow-lg gap-1">
                        <button
                            onClick={() => navigateToStyle('/poster/collage')}
                            className="px-6 py-1.5 rounded-full text-zinc-600 dark:text-white/70 text-xs font-medium hover:text-primary dark:hover:text-white transition-all"
                        >
                            拼贴
                        </button>
                        <button className="px-6 py-1.5 rounded-full bg-white dark:bg-white text-black text-xs font-bold shadow-md transition-all">
                            网格
                        </button>
                        <button
                            onClick={() => navigateToStyle('/poster/book')}
                            className="px-6 py-1.5 rounded-full text-zinc-600 dark:text-white/70 text-xs font-medium hover:text-primary dark:hover:text-white transition-all"
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
                        <button className="w-14 h-14 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 backdrop-blur-xl rounded-xl flex items-center justify-center transition-all border border-black/5 dark:border-white/10 text-zinc-900 dark:text-white">
                            <span className="material-icons-round text-2xl">ios_share</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PosterGrid;