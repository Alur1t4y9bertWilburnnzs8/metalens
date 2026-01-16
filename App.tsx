import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom';
import Login from './pages/Login';
import Library from './pages/Library';
import CreateAlbum from './pages/CreateAlbum';
import UploadDetails from './pages/UploadDetails';
import Community from './pages/Community';
import ImageDetail from './pages/ImageDetail';
import AlbumDetail from './pages/AlbumDetail';
import PosterCollage from './pages/PosterCollage';
import PosterGrid from './pages/PosterGrid';
import PosterBook from './pages/PosterBook';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import UserList from './pages/UserList';
import Notifications from './pages/Notifications';
import BottomNav from './components/BottomNav';
import { FavoritesProvider } from './context/FavoritesContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

// Navigation Logger
const NavigationLogger: React.FC = () => {
    const location = useLocation();
    const navType = useNavigationType();

    React.useEffect(() => {
        console.log(`[Nav] ${navType}: ${location.pathname}`);
    }, [location, navType]);

    return null;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <DataProvider>
                <FavoritesProvider>
                    <Router>
                        <NavigationLogger />
                        <div className="min-h-screen bg-[#070b14] dark:bg-[#070b14]">
                            {/* 
                           --------------------------------------------------------
                           [CRITICAL CHECK] Router Structure
                           --------------------------------------------------------
                           Action: Flat <Routes> container.
                           Rule: No nested <Routes> inside sub-components.
                           Result: Single History Stack managed by HashRouter.
                           --------------------------------------------------------
                        */}
                            <Routes>
                                <Route path="/" element={<Login />} />

                                {/* Level 1: Main Tabs */}
                                <Route path="/library" element={<Library />} />
                                <Route path="/community" element={<Community />} />
                                <Route path="/profile" element={<Profile />} />

                                {/* Level 2: Details (Must be siblings to Level 1) */}
                                <Route path="/album/:id" element={<AlbumDetail />} />
                                <Route path="/image/:id" element={<ImageDetail />} />
                                <Route path="/create" element={<CreateAlbum />} />
                                <Route path="/upload" element={<UploadDetails />} />

                                {/* Level 2: Profile Sub-pages */}
                                <Route path="/favorites" element={<Favorites />} />
                                <Route path="/notifications" element={<Notifications />} />
                                <Route path="/user/:userId" element={<Profile />} />
                                <Route path="/user/:userId/:type" element={<UserList />} />

                                {/* Tools */}
                                <Route path="/poster/collage" element={<PosterCollage />} />
                                <Route path="/poster/grid" element={<PosterGrid />} />
                                <Route path="/poster/book" element={<PosterBook />} />

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                            <BottomNav />
                        </div>
                    </Router>
                </FavoritesProvider>
            </DataProvider>
        </AuthProvider>
    );
};

export default App;