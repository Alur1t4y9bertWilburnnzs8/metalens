import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Only show on main tab pages
    const mainTabs = ['/library', '/community', '/profile'];
    if (!mainTabs.includes(location.pathname)) return null;

    const isActive = (path: string) => location.pathname === path;

    const handleNav = (path: string) => {
        if (location.pathname !== path) {
            navigate(path);
        }
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 w-full mx-auto max-w-md border-t border-black/5 dark:border-white/5 bg-background-light/95 dark:bg-[#151a24]/95 backdrop-blur-lg pb-safe pt-2 pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex h-16 items-center justify-around px-2 max-w-md mx-auto">
                <button
                    onClick={() => handleNav('/community')}
                    className={`group flex flex-1 flex-col items-center justify-center gap-1 ${isActive('/community') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    <div className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${isActive('/community') ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-black/5 dark:group-hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined text-[24px] ${isActive('/community') ? 'icon-filled' : ''}`}>public</span>
                    </div>
                    <span className="text-[10px] font-medium">社区</span>
                </button>

                <button
                    onClick={() => handleNav('/library')}
                    className={`group flex flex-1 flex-col items-center justify-center gap-1 ${isActive('/library') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    <div className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${isActive('/library') ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-black/5 dark:group-hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined text-[24px] ${isActive('/library') ? 'icon-filled' : ''}`}>photo_library</span>
                    </div>
                    <span className="text-[10px] font-medium">我的相册</span>
                </button>

                <button
                    onClick={() => handleNav('/profile')}
                    className={`group flex flex-1 flex-col items-center justify-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
                >
                    <div className={`flex h-8 w-12 items-center justify-center rounded-full transition-colors ${isActive('/profile') ? 'bg-primary/10 dark:bg-primary/20' : 'group-hover:bg-black/5 dark:group-hover:bg-white/5'}`}>
                        <span className={`material-symbols-outlined text-[24px] ${isActive('/profile') ? 'icon-filled' : ''}`}>person</span>
                    </div>
                    <span className="text-[10px] font-medium">个人中心</span>
                </button>
            </div>
        </nav>
    );
};

export default BottomNav;