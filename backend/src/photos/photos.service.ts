import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Injectable()
export class PhotosService {
    constructor(
        private prisma: PrismaService,
        private supabaseService: SupabaseService,
    ) { }

    /**
     * 创建照片
     */
    async create(profileId: string, createPhotoDto: CreatePhotoDto) {
        // 验证相册是否属于当前用户
        const album = await this.prisma.album.findUnique({
            where: { id: createPhotoDto.albumId },
        });

        if (!album) {
            throw new NotFoundException('相册不存在');
        }

        if (album.profileId !== profileId) {
            throw new ForbiddenException('无权限添加照片到此相册');
        }

        const photo = await this.prisma.photo.create({
            data: {
                ...createPhotoDto,
                profileId,
                metadata: createPhotoDto.metadata || {},
            },
        });

        // 更新相册封面（如果是第一张照片）
        const photoCount = await this.prisma.photo.count({
            where: { albumId: createPhotoDto.albumId },
        });

        if (photoCount === 1) {
            await this.prisma.album.update({
                where: { id: createPhotoDto.albumId },
                data: { coverUrl: createPhotoDto.url },
            });
        }

        return photo;
    }

    /**
     * 获取用户的所有照片
     */
    async findByProfile(profileId: string) {
        return this.prisma.photo.findMany({
            where: { profileId },
            include: {
                album: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * 获取照片详情
     */
    async findOne(id: number) {
        const photo = await this.prisma.photo.findUnique({
            where: { id },
            include: {
                album: true,
                profile: true,
                likes: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!photo) {
            throw new NotFoundException('照片不存在');
        }

        return {
            ...photo,
            likesCount: photo.likes.length,
            likedBy: photo.likes.map(like => ({
                id: like.profile.id,
                username: like.profile.username,
                avatarUrl: like.profile.avatarUrl,
            })),
        };
    }

    /**
     * 更新照片信息
     */
    async update(id: number, profileId: string, updatePhotoDto: UpdatePhotoDto) {
        const photo = await this.prisma.photo.findUnique({
            where: { id },
        });

        if (!photo) {
            throw new NotFoundException('照片不存在');
        }

        if (photo.profileId !== profileId) {
            throw new ForbiddenException('无权限修改此照片');
        }

        return this.prisma.photo.update({
            where: { id },
            data: updatePhotoDto,
        });
    }

    /**
     * 切换照片公开状态
     */
    async togglePrivacy(id: number, profileId: string) {
        const photo = await this.prisma.photo.findUnique({
            where: { id },
        });

        if (!photo) {
            throw new NotFoundException('照片不存在');
        }

        if (photo.profileId !== profileId) {
            throw new ForbiddenException('无权限修改此照片');
        }

        return this.prisma.photo.update({
            where: { id },
            data: { isPublic: !photo.isPublic },
        });
    }

    /**
     * 删除照片
     */
    async remove(id: number, profileId: string) {
        const photo = await this.prisma.photo.findUnique({
            where: { id },
        });

        if (!photo) {
            throw new NotFoundException('照片不存在');
        }

        if (photo.profileId !== profileId) {
            throw new ForbiddenException('无权限删除此照片');
        }

        // 执行数据库删除
        await this.prisma.photo.delete({
            where: { id },
        });

        // 同步删除 Supabase Storage 中的物理文件
        try {
            const pathsToRemove: string[] = [];

            const originalPath = this.supabaseService.extractPathFromUrl(photo.url);
            if (originalPath) pathsToRemove.push(originalPath);

            const thumbPath = this.supabaseService.extractPathFromUrl(photo.thumbnailUrl || '');
            if (thumbPath) pathsToRemove.push(thumbPath);

            if (pathsToRemove.length > 0) {
                await this.supabaseService.getClient()
                    .storage
                    .from('metalens-assets')
                    .remove(pathsToRemove);

                console.log(`Successfully removed files from storage: ${pathsToRemove.join(', ')}`);
            }
        } catch (error) {
            // 存储删除失败时不抛出异常，记录日志即可，避免影响业务流程
            console.error('Failed to remove files from Supabase Storage:', error);
        }

        return { message: '照片已删除' };
    }
}
