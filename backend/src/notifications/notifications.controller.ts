import {
    Controller,
    Get,
    Patch,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    /**
     * 获取当前用户的通知列表
     */
    @Get()
    @UseGuards(AuthGuard)
    findAll(@Request() req) {
        return this.notificationsService.findByProfile(req.user.profileId);
    }

    /**
     * 获取未读通知数量
     */
    @Get('unread-count')
    @UseGuards(AuthGuard)
    getUnreadCount(@Request() req) {
        return this.notificationsService.getUnreadCount(req.user.profileId);
    }

    /**
     * 标记通知为已读
     */
    @Patch(':id/read')
    @UseGuards(AuthGuard)
    markAsRead(@Param('id') id: string, @Request() req) {
        return this.notificationsService.markAsRead(id, req.user.profileId);
    }

    /**
     * 标记所有通知为已读
     */
    @Patch('read-all')
    @UseGuards(AuthGuard)
    markAllAsRead(@Request() req) {
        return this.notificationsService.markAllAsRead(req.user.profileId);
    }
}
