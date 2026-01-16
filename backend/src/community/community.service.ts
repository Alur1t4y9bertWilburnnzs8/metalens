import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunityService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取社区动态（公开照片）
     */
    async getFeed(page: number = 1, limit: number = 20, currentUserId?: string) {
        const skip = (page - 1) * limit;

        const photos = await this.prisma.photo.findMany({
            where: { isPublic: true },
            include: {
                profile: true,
                album: true,
                _count: {
                    select: { likes: true },
                },
                likes: currentUserId
                    ? {
                        where: { profileId: currentUserId },
                    }
                    : false,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });

        // 转换为前端需要的格式
        return photos.map(photo => ({
            id: photo.id,
            title: photo.title || '无标题',
            author: photo.profile.username,
            authorId: photo.profile.id,
            avatar: photo.profile.avatarUrl,
            album: photo.album.title,
            category: this.getCategoryLabel(photo.album.type),
            src: photo.url,
            thumbnailUrl: photo.thumbnailUrl,
            aspect: 'aspect-auto',
            liked: currentUserId ? photo.likes.length > 0 : false,
            likesCount: photo._count.likes,
            meta: photo.metadata,
            isUserPost: currentUserId === photo.profileId,
        }));
    }

    /**
     * 点赞/取消点赞
     */
    async toggleLike(photoId: number, actorProfileId: string) {
        // 检查照片是否存在
        const photo = await this.prisma.photo.findUnique({
            where: { id: photoId },
        });

        if (!photo) {
            throw new Error('照片不存在');
        }

        // 检查是否已点赞
        const existingLike = await this.prisma.like.findUnique({
            where: {
                profileId_photoId: {
                    profileId: actorProfileId,
                    photoId: photoId,
                },
            },
        });

        if (existingLike) {
            // 取消点赞
            await this.prisma.like.delete({
                where: { id: existingLike.id },
            });
            return { liked: false, message: '已取消点赞' };
        } else {
            // 点赞
            await this.prisma.like.create({
                data: {
                    profileId: actorProfileId,
                    photoId,
                },
            });

            // 如果不是自己的照片，创建通知
            if (photo.profileId !== actorProfileId) {
                await this.prisma.notification.create({
                    data: {
                        profileId: photo.profileId, // Recipient
                        actorId: actorProfileId,    // Sender
                        targetId: photoId.toString(),
                        type: 'like',
                        content: `收藏了你的作品`,
                    },
                });
            }

            return { liked: true, message: '点赞成功' };
        }
    }

    /**
     * 获取照片的点赞列表
     */
    async getLikes(photoId: number) {
        const likes = await this.prisma.like.findMany({
            where: { photoId },
            include: {
                profile: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return likes.map(like => ({
            id: like.profile.id,
            username: like.profile.username,
            avatar: like.profile.avatarUrl,
            likedAt: like.createdAt,
        }));
    }

    /**
     * 获取分类标签
     */
    private getCategoryLabel(type: string): string {
        const labels = {
            photo: '摄影',
            ai: 'AI 艺术',
            paint: '绘画艺术',
        };
        return labels[type] || type;
    }
}
