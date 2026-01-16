import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('albums')
export class AlbumsController {
    constructor(private readonly albumsService: AlbumsService) { }

    /**
     * 创建相册
     */
    @Post()
    @UseGuards(AuthGuard)
    create(@Request() req, @Body() createAlbumDto: CreateAlbumDto) {
        return this.albumsService.create(req.user.profileId, createAlbumDto);
    }

    /**
     * 获取当前用户的相册列表
     */
    @Get()
    @UseGuards(AuthGuard)
    findAll(@Request() req) {
        return this.albumsService.findByProfile(req.user.profileId);
    }

    /**
     * 获取相册详情
     */
    @Get(':id')
    findOne(@Param('id') id: string, @Request() req) {
        const userId = req.user?.profileId;
        return this.albumsService.findOne(+id, userId);
    }

    /**
     * 更新相册信息
     */
    @Patch(':id')
    @UseGuards(AuthGuard)
    update(
        @Param('id') id: string,
        @Request() req,
        @Body() updateAlbumDto: UpdateAlbumDto,
    ) {
        return this.albumsService.update(+id, req.user.profileId, updateAlbumDto);
    }

    /**
     * 删除相册
     */
    @Delete(':id')
    @UseGuards(AuthGuard)
    remove(@Param('id') id: string, @Request() req) {
        return this.albumsService.remove(+id, req.user.profileId);
    }
}
