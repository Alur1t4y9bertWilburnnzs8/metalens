import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    /**
     * 辅助方法：通过 ID 或用户名查找用户 Profile
     */
    private async findProfileByIdOrUsername(identifier: string) {
        // 首先尝试通过 ID (UUID) 查找
        let profile = await this.prisma.profile.findUnique({
            where: { id: identifier },
            include: {
                _count: {
                    select: {
                        photos: { where: { isPublic: true } },
                        followers: true,
                        following: true,
                        likes: true,
                    },
                },
            },
        });

        // 如果找不到，尝试通过用户名查找
        if (!profile) {
            profile = await this.prisma.profile.findUnique({
                where: { username: identifier },
                include: {
                    _count: {
                        select: {
                            photos: { where: { isPublic: true } },
                            followers: true,
                            following: true,
                            likes: true,
                        },
                    },
                },
            });
        }

        return profile;
    }

    /**
     * 获取当前用户资料
     */
    async getMe(profileId: string) {
        const profile = await this.prisma.profile.findUnique({
            where: { id: profileId },
            include: {
                _count: {
                    select: {
                        photos: true,
                        followers: true,
                        following: true,
                        likes: true,
                    },
                },
            },
        });

        if (!profile) {
            throw new NotFoundException('用户不存在');
        }

        return {
            id: profile.id,
            userId: profile.userId,
            username: profile.username,
            name: profile.username,
            avatar: profile.avatarUrl,
            bio: profile.bio,
            role: profile.role,
            stats: {
                works: profile._count.photos,
                followers: profile._count.followers,
                following: profile._count.following,
                likes: profile._count.likes,
            },
        };
    }

    /**
     * 获取指定用户资料
     */
    async getProfile(identifier: string, currentUserId?: string) {
        const profile = await this.findProfileByIdOrUsername(identifier);

        if (!profile) {
            throw new NotFoundException('用户不存在');
        }

        // 检查当前用户是否关注了该用户
        let isFollowing = false;
        if (currentUserId) {
            const follow = await this.prisma.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId: currentUserId,
                        followingId: profile.id,
                    },
                },
            });
            isFollowing = !!follow;
        }

        return {
            id: profile.id,
            username: profile.username,
            name: profile.username,
            avatar: profile.avatarUrl,
            bio: profile.bio,
            role: profile.role,
            isFollowing,
            stats: {
                works: profile._count.photos,
                followers: profile._count.followers,
                following: profile._count.following,
            },
        };
    }

    /**
     * 更新用户资料
     */
    async updateProfile(profileId: string, updateProfileDto: UpdateProfileDto) {
        return this.prisma.profile.update({
            where: { id: profileId },
            data: updateProfileDto,
        });
    }

    /**
     * 关注/取消关注用户
     */
    async toggleFollow(followerId: string, followingIdentifier: string) {
        const targetProfile = await this.findProfileByIdOrUsername(followingIdentifier);

        if (!targetProfile) {
            throw new NotFoundException('目标用户不存在');
        }

        const followingId = targetProfile.id;

        if (followerId === followingId) {
            throw new Error('不能关注自己');
        }

        const existingFollow = await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        if (existingFollow) {
            await this.prisma.follow.delete({
                where: { id: existingFollow.id },
            });
            return { isFollowing: false, message: '已取消关注' };
        } else {
            await this.prisma.follow.create({
                data: {
                    followerId,
                    followingId,
                },
            });

            await this.prisma.notification.create({
                data: {
                    profileId: followingId,
                    actorId: followerId,
                    type: 'follow',
                    content: `开始关注你了`,
                },
            });

            return { isFollowing: true, message: '关注成功' };
        }
    }

    /**
     * 获取粉丝列表
     */
    async getFollowers(identifier: string) {
        const profile = await this.findProfileByIdOrUsername(identifier);
        if (!profile) throw new NotFoundException('用户不存在');

        const followers = await this.prisma.follow.findMany({
            where: { followingId: profile.id },
            include: {
                follower: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return followers.map(f => ({
            id: f.follower.id,
            username: f.follower.username,
            avatar: f.follower.avatarUrl,
            bio: f.follower.bio,
            role: f.follower.role,
        }));
    }

    /**
     * 获取关注列表
     */
    async getFollowing(identifier: string) {
        const profile = await this.findProfileByIdOrUsername(identifier);
        if (!profile) throw new NotFoundException('用户不存在');

        const following = await this.prisma.follow.findMany({
            where: { followerId: profile.id },
            include: {
                following: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return following.map(f => ({
            id: f.following.id,
            username: f.following.username,
            avatar: f.following.avatarUrl,
            bio: f.following.bio,
            role: f.following.role,
        }));
    }
}
