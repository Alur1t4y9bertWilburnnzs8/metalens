export interface Album {
    id: string;
    title: string;
    cover: string;
    type: 'photo' | 'ai' | 'paint';
    typeLabel: string;
    count: number;
    color?: string;
}

export interface Photo {
    id: string;
    albumId: string;
    src: string;
    title: string;
    isPublic: boolean;
    meta?: {
        camera?: string;
        params?: string;
        prompt?: string;
        model?: string;
        tool?: string;
    };
}

export interface CommunityPost {
    id: number | string;
    title: string;
    author: string;
    authorId: string;
    avatar?: string;
    album: string;
    category: '摄影' | 'AI 艺术' | '插画' | '绘画艺术';
    src: string;
    aspect: string;
    liked: boolean;
    likesCount?: number;
    isUserPost?: boolean;
    meta?: {
        camera?: string;
        params?: string;
        prompt?: string;
        model?: string;
        tool?: string;
    };
}

export interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    role: string;
}

export interface Notification {
    id: string;
    type: 'like' | 'follow';
    userId: string; // actorId
    actorName?: string;
    actorAvatar?: string | null;
    targetId?: string;
    timestamp: string;
    isRead: boolean;
    content?: string;
}
