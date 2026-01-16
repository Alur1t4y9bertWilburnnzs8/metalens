import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Photo, CommunityPost, Album, UserProfile, Notification } from '../types';
import * as albumsApi from '../api/albums';
import * as photosApi from '../api/photos';
import * as uploadsApi from '../api/uploads';
import * as communityApi from '../api/community';
import * as usersApi from '../api/users';
import * as notificationsApi from '../api/notifications';
import { useAuth } from './AuthContext';

interface DataContextType {
    albums: Album[];
    userPhotos: Photo[];
    communityPosts: CommunityPost[];
    allPublicPosts: CommunityPost[];
    loading: boolean;
    togglePhotoPrivacy: (photoId: string) => Promise<void>;
    deletePhoto: (photoId: string) => Promise<void>;
    getPhotosByAlbum: (albumId: string) => Photo[];
    createAlbum: (title: string, type: 'photo' | 'ai' | 'paint') => Promise<Album>;
    addPhoto: (photo: any) => Promise<void>;
    getUser: (userId?: string) => Promise<UserProfile | undefined>;
    getFollowers: (userId: string) => Promise<UserProfile[]>;
    getFollowing: (userId: string) => Promise<UserProfile[]>;
    toggleFollow: (targetUserId: string) => Promise<void>;
    isFollowing: (targetUserId: string) => boolean;
    deleteAlbum: (albumId: string) => Promise<void>;
    currentUser: UserProfile | null;
    updateUser: (updates: any) => Promise<void>;
    notifications: Notification[];
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: authUser, isAuthenticated } = useAuth();
    const [albums, setAlbums] = useState<Album[]>([]);
    const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
    const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [followingIds, setFollowingIds] = useState<string[]>([]);

    // Convert AuthUser to UserProfile for backward compatibility with existing UI
    const currentUser: UserProfile | null = authUser ? {
        id: authUser.id,
        name: authUser.username,
        avatar: authUser.avatar || '',
        bio: authUser.bio || '',
        role: authUser.role
    } : null;

    const refreshData = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const [albumsData, photosData, communityData, notificationsData, followingData] = await Promise.all([
                albumsApi.getAlbums(),
                photosApi.getPhotos(),
                communityApi.getCommunityFeed(),
                notificationsApi.getNotifications(),
                authUser ? usersApi.getUserFollowing(authUser.id) : Promise.resolve([])
            ]);

            // Map Backend Album to Frontend Album
            const mappedAlbums: Album[] = albumsData.map((a: any) => {
                const albumPhotos = photosData.filter((p: any) => String(p.albumId) === String(a.id));
                return {
                    id: a.id.toString(),
                    title: a.title,
                    cover: a.coverUrl || (albumPhotos.length > 0 ? (albumPhotos[0] as any).url : "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"),
                    type: a.type as any,
                    typeLabel: a.type === 'photo' ? '摄影' : a.type === 'ai' ? 'AI 艺术' : '绘画艺术',
                    count: albumPhotos.length,
                    color: a.type === 'photo' ? 'bg-blue-500' : a.type === 'ai' ? 'bg-purple-500' : 'bg-orange-500'
                };
            });

            // Map Backend Photo to Frontend Photo
            const mappedPhotos: Photo[] = photosData.map((p: any) => ({
                id: p.id.toString(),
                albumId: p.albumId.toString(),
                src: p.url,
                title: p.title || '未命名',
                isPublic: p.isPublic,
                meta: p.metadata
            }));

            setAlbums(mappedAlbums);
            setUserPhotos(mappedPhotos);
            setCommunityPosts(communityData);
            setNotifications(notificationsData);
            setFollowingIds(followingData.map((u: any) => u.id));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            refreshData();
        } else {
            setAlbums([]);
            setUserPhotos([]);
            setCommunityPosts([]);
            setNotifications([]);
            setFollowingIds([]);
        }
    }, [isAuthenticated]);

    const togglePhotoPrivacy = async (photoId: string) => {
        try {
            await photosApi.togglePhotoPrivacy(photoId);
            setUserPhotos(prev =>
                prev.map(p => p.id === photoId ? { ...p, isPublic: !p.isPublic } : p)
            );
        } catch (error: any) {
            console.error('Toggle privacy failed:', error);
            alert(`切换隐私状态失败: ${error?.response?.data?.message || error.message || '未知错误'}`);
        }
    };

    const deletePhoto = async (photoId: string) => {
        try {
            await photosApi.deletePhoto(photoId);
            setUserPhotos(prev => prev.filter(p => String(p.id) !== String(photoId)));
            // Refresh to update counts and covers
            await refreshData();
        } catch (error: any) {
            console.error('Delete photo failed:', error);
            alert(`删除失败: ${error?.response?.data?.message || '未知错误'}`);
        }
    };

    const getPhotosByAlbum = (albumId: string) => {
        return userPhotos.filter(p => p.albumId === albumId);
    };

    const createAlbum = async (title: string, type: 'photo' | 'ai' | 'paint'): Promise<Album> => {
        const rawAlbum = await albumsApi.createAlbum({ title, type });
        const newAlbum: Album = {
            id: rawAlbum.id.toString(),
            title: rawAlbum.title,
            cover: rawAlbum.coverUrl || "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: rawAlbum.type as any,
            typeLabel: rawAlbum.type === 'photo' ? '摄影' : rawAlbum.type === 'ai' ? 'AI 艺术' : '绘画艺术',
            count: 0,
            color: rawAlbum.type === 'photo' ? 'bg-blue-500' : rawAlbum.type === 'ai' ? 'bg-purple-500' : 'bg-orange-500'
        };
        setAlbums(prev => [newAlbum, ...prev]);
        return newAlbum;
    };

    const deleteAlbum = async (albumId: string) => {
        try {
            await albumsApi.deleteAlbum(albumId);
            setAlbums(prev => prev.filter(a => String(a.id) !== String(albumId)));
            setUserPhotos(prev => prev.filter(p => String(p.albumId) !== String(albumId)));
            // Full refresh to be safe and update any related counts
            await refreshData();
        } catch (error: any) {
            console.error('Delete album failed:', error);
            alert(`删除失败: ${error?.response?.data?.message || '未知错误'}`);
        }
    };

    const uploadPhoto = async (file: File, data: any) => {
        const result = await uploadsApi.uploadPhoto(file, data);
        await refreshData();
        return result;
    };

    const uploadAvatar = async (file: File) => {
        return await uploadsApi.uploadAvatar(file);
    };

    const addPhoto = async (photoData: any) => {
        await photosApi.createPhoto(photoData);
        // Full refresh to ensure covers and counts are correct from backend
        await refreshData();
    };

    const allPublicPosts = useMemo(() => {
        // Combinine user's public photos with community feed
        const userPublicPosts: CommunityPost[] = userPhotos
            .filter(photo => photo.isPublic)
            .map(photo => {
                const album = albums.find(a => a.id === photo.albumId);
                return {
                    id: photo.id,
                    title: photo.title || '无题',
                    author: currentUser?.name || '我',
                    authorId: currentUser?.id || '',
                    avatar: currentUser?.avatar,
                    album: album?.title || '我的相册',
                    category: (album?.typeLabel as any) || '摄影',
                    src: photo.src,
                    aspect: 'aspect-auto',
                    liked: false,
                    likesCount: 0,
                    isUserPost: true,
                    meta: photo.meta
                };
            });

        const filteredCommunity = communityPosts.filter(cp => cp.authorId !== currentUser?.id);
        return [...userPublicPosts, ...filteredCommunity];
    }, [userPhotos, communityPosts, albums, currentUser]);

    const getUser = async (userId?: string) => {
        if (!userId || userId === currentUser?.id) return currentUser || undefined;
        return await usersApi.getUserProfile(userId);
    };

    const getFollowers = async (userId: string) => {
        return await usersApi.getUserFollowers(userId);
    };

    const getFollowing = async (userId: string) => {
        return await usersApi.getUserFollowing(userId);
    };

    const toggleFollow = async (targetUserId: string) => {
        await usersApi.toggleFollow(targetUserId);
        setFollowingIds(prev =>
            prev.includes(targetUserId)
                ? prev.filter(id => id !== targetUserId)
                : [...prev, targetUserId]
        );
    };

    const isFollowing = (targetUserId: string) => {
        return followingIds.includes(targetUserId);
    };

    const updateUser = async (updates: any) => {
        await usersApi.updateMyProfile(updates);
        // AuthContext will handle the local user state update if we call refreshUser
    };

    return (
        <DataContext.Provider value={{
            albums,
            userPhotos,
            communityPosts,
            allPublicPosts,
            loading,
            togglePhotoPrivacy,
            deletePhoto,
            getPhotosByAlbum,
            createAlbum,
            deleteAlbum,
            uploadPhoto,
            uploadAvatar,
            addPhoto,
            getUser,
            getFollowers,
            getFollowing,
            toggleFollow,
            isFollowing,
            currentUser,
            updateUser,
            notifications,
            refreshData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};