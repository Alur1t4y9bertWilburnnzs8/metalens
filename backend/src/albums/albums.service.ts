import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
    constructor(
        private prisma: PrismaService,
        private supabaseService: SupabaseService,
    ) { }

    /**
     * 创建相册
     */
    async create(profileId: string, createAlbumDto: CreateAlbumDto) {
        return this.prisma.album.create({
            data: {
                ...createAlbumDto,
                profileId,
            },
        });
    }

    /**
     * 获取用户的所有相册
     */
    async findByProfile(profileId: string) {
        const albums = await this.prisma.album.findMany({
            where: { profileId },
            include: {
                _count: {
                    select: { photos: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // 转换为前端需要的格式
        return albums.map(album => ({
            id: album.id.toString(),
            title: album.title,
            type: album.type,
            typeLabel: this.getTypeLabel(album.type),
            cover: album.coverUrl || '',
            count: album._count.photos,
            color: album.type === 'ai' ? 'primary' : undefined,
        }));
    }

    /**
     * 获取相册详情（包含照片）
     */
    async findOne(id: number, userId?: string) {
        const album = await this.prisma.album.findUnique({
            where: { id },
            include: {
                photos: {
                    orderBy: { createdAt: 'desc' },
                },
                profile: true,
            },
        });

        if (!album) {
            throw new NotFoundException('相册不存在');
        }

        // 如果不是相册所有者，只返回公开照片
        const photos = userId === album.profileId
            ? album.photos
            : album.photos.filter(p => p.isPublic);

        return {
            ...album,
            photos: photos.map(photo => ({
                id: photo.id.toString(),
                albumId: album.id.toString(),
                src: photo.url,
                title: photo.title || '',
                isPublic: photo.isPublic,
                meta: photo.metadata,
            })),
        };
    }

    /**
     * 更新相册
     */
    async update(id: number, profileId: string, updateAlbumDto: UpdateAlbumDto) {
        // 检查相册是否属于当前用户
        const album = await this.prisma.album.findUnique({
            where: { id },
        });

        if (!album) {
            throw new NotFoundException('相册不存在');
        }

        if (album.profileId !== profileId) {
            throw new ForbiddenException('无权限修改此相册');
        }

        return this.prisma.album.update({
            where: { id },
            data: updateAlbumDto,
        });
    }

    /**
     * 删除相册
     */
    async remove(id: number, profileId: string) {
        // 检查相册是否属于当前用户
        const album = await this.prisma.album.findUnique({
            where: { id },
            include: {
                photos: true,
            },
        });

        if (!album) {
            throw new NotFoundException('相册不存在');
        }

        if (album.profileId !== profileId) {
            throw new ForbiddenException('无权限删除此相册');
        }

        // 1. 收集所有需要删除的存储路径
        const pathsToRemove: string[] = [];
        album.photos.forEach(photo => {
            const originalPath = this.supabaseService.extractPathFromUrl(photo.url);
            if (originalPath) pathsToRemove.push(originalPath);

            const thumbPath = this.supabaseService.extractPathFromUrl(photo.thumbnailUrl || '');
            if (thumbPath) pathsToRemove.push(thumbPath);
        });

        // 2. 执行数据库删除（级联删除会处理 Photo 记录）
        await this.prisma.album.delete({
            where: { id },
        });

        // 3. 异步清理 Supabase Storage 中的文件
        if (pathsToRemove.length > 0) {
            try {
                // 如果文件较多，Supabase 的 remove 方法有限额，但通常相册照片量不会超过该限制
                await this.supabaseService.getClient()
                    .storage
                    .from('metalens-assets')
                    .remove(pathsToRemove);

                console.log(`Successfully removed ${pathsToRemove.length} files from storage for album ${id}`);
            } catch (error) {
                console.error('Failed to remove album files from Supabase Storage:', error);
            }
        }

        return { message: '相册及照片已删除' };
    }

    /**
     * 获取类型标签
     */
    private getTypeLabel(type: string): string {
        const labels = {
            photo: '摄影',
            ai: 'AI 艺术',
            paint: '绘画艺术',
        };
        return labels[type] || type;
    }
}
