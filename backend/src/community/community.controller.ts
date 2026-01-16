import { Controller, Get, Post, Param, Query, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard, OptionalAuthGuard } from '../auth/auth.guard';

@Controller('community')
export class CommunityController {
    constructor(private readonly communityService: CommunityService) { }

    /**
     * 获取社区动态
     */
    @Get('feed')
    @UseGuards(OptionalAuthGuard)
    async getFeed(@Query('page') page: string, @Query('limit') limit: string, @Request() req?) {
        const currentUserId = req?.user?.profileId;
        console.log('GetFeed User:', currentUserId);
        return this.communityService.getFeed(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20,
            currentUserId,
        );
    }

    /**
     * 点赞/取消点赞照片
     */
    @Post(':photoId/like')
    @UseGuards(AuthGuard)
    async toggleLike(@Param('photoId') photoId: string, @Request() req) {
        return this.communityService.toggleLike(+photoId, req.user.profileId);
    }

    /**
     * 获取照片的点赞列表
     */
    @Get(':photoId/likes')
    async getLikes(@Param('photoId') photoId: string) {
        return this.communityService.getLikes(+photoId);
    }
}
