import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    /**
     * 获取用户的通知列表
     */
    async findByProfile(profileId: string) {
        const notifications = await this.prisma.notification.findMany({
            where: { profileId },
            include: {
                actor: {
                    select: {
                        id: true,
                        username: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return notifications.map(n => ({
            id: n.id,
            type: n.type,
            content: n.content,
            isRead: n.isRead,
            createdAt: n.createdAt,
            userId: n.actorId,
            actorName: n.actor?.username || '用户',
            actorAvatar: n.actor?.avatarUrl || null,
            targetId: n.targetId,
            timestamp: this.formatDistanceToNow(n.createdAt), // 后端格式化方便前端
        }));
    }

    private formatDistanceToNow(date: Date): string {
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}天前`;
        if (hours > 0) return `${hours}小时前`;
        if (minutes > 0) return `${minutes}分钟前`;
        return '刚刚';
    }

    /**
     * 标记通知为已读
     */
    async markAsRead(id: string, profileId: string) {
        const notification = await this.prisma.notification.findFirst({
            where: { id, profileId },
        });

        if (!notification) {
            throw new Error('通知不存在');
        }

        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }

    /**
     * 标记所有通知为已读
     */
    async markAllAsRead(profileId: string) {
        await this.prisma.notification.updateMany({
            where: { profileId, isRead: false },
            data: { isRead: true },
        });

        return { message: '所有通知已标记为已读' };
    }

    /**
     * 获取未读通知数量
     */
    async getUnreadCount(profileId: string) {
        const count = await this.prisma.notification.count({
            where: { profileId, isRead: false },
        });

        return { count };
    }
}
