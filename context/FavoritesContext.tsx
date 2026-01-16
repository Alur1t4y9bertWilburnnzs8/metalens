import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CommunityPost } from '../types';
import * as communityApi from '../api/community';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
    favorites: CommunityPost[];
    toggleFavorite: (item: CommunityPost) => Promise<void>;
    isFavorite: (id: number | string) => boolean;
    refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState<CommunityPost[]>([]);

    const refreshFavorites = async () => {
        if (!isAuthenticated) return;
        try {
            // In a real app, we might have a specific endpoint for user's favorites
            // For now, we'll fetch the feed and filter or just manage local state
            // since the backend 'Like' records are there.
            // Let's assume the feed API already returns 'liked: true' for items the user likes.
            const feed = await communityApi.getCommunityFeed();
            setFavorites(feed.filter(post => post.liked));
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshFavorites();
        } else {
            setFavorites([]);
        }
    }, [isAuthenticated]);

    const isFavorite = (id: number | string) => {
        return favorites.some(item => item.id === id);
    };

    const toggleFavorite = async (item: CommunityPost) => {
        try {
            await communityApi.toggleLike(item.id);

            setFavorites(prev => {
                const exists = prev.some(fav => fav.id === item.id);
                if (exists) {
                    return prev.filter(fav => fav.id !== item.id);
                } else {
                    return [{ ...item, liked: true }, ...prev];
                }
            });
        } catch (error) {
            console.error('Toggle favorite failed:', error);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, refreshFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};