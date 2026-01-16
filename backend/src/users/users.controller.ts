import {
    Controller,
    Get,
    Patch,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * 获取当前用户资料
     */
    @Get('me')
    @UseGuards(AuthGuard)
    getMe(@Request() req) {
        return this.usersService.getMe(req.user.profileId);
    }

    /**
     * 更新当前用户资料
     */
    @Patch('me')
    @UseGuards(AuthGuard)
    updateMe(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.profileId, updateProfileDto);
    }

    /**
     * 获取指定用户资料
     */
    @Get(':id')
    getProfile(@Param('id') id: string, @Request() req) {
        const currentUserId = req.user?.profileId;
        return this.usersService.getProfile(id, currentUserId);
    }

    /**
     * 关注/取消关注用户
     */
    @Post(':id/follow')
    @UseGuards(AuthGuard)
    toggleFollow(@Param('id') id: string, @Request() req) {
        return this.usersService.toggleFollow(req.user.profileId, id);
    }

    /**
     * 获取用户的粉丝列表
     */
    @Get(':id/followers')
    getFollowers(@Param('id') id: string) {
        return this.usersService.getFollowers(id);
    }

    /**
     * 获取用户的关注列表
     */
    @Get(':id/following')
    getFollowing(@Param('id') id: string) {
        return this.usersService.getFollowing(id);
    }
}
