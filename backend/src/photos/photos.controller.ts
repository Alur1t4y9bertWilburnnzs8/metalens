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
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('photos')
export class PhotosController {
    constructor(private readonly photosService: PhotosService) { }

    /**
     * 创建照片记录
     */
    @Post()
    @UseGuards(AuthGuard)
    create(@Request() req, @Body() createPhotoDto: CreatePhotoDto) {
        return this.photosService.create(req.user.profileId, createPhotoDto);
    }

    /**
     * 获取当前用户的所有照片
     */
    @Get()
    @UseGuards(AuthGuard)
    findAll(@Request() req) {
        return this.photosService.findByProfile(req.user.profileId);
    }

    /**
     * 获取照片详情
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.photosService.findOne(+id);
    }

    /**
     * 更新照片信息
     */
    @Patch(':id')
    @UseGuards(AuthGuard)
    update(
        @Param('id') id: string,
        @Request() req,
        @Body() updatePhotoDto: UpdatePhotoDto,
    ) {
        return this.photosService.update(+id, req.user.profileId, updatePhotoDto);
    }

    /**
     * 切换照片公开状态
     */
    @Post(':id/toggle-privacy')
    @UseGuards(AuthGuard)
    togglePrivacy(@Param('id') id: string, @Request() req) {
        return this.photosService.togglePrivacy(+id, req.user.profileId);
    }

    /**
     * 删除照片
     */
    @Delete(':id')
    @UseGuards(AuthGuard)
    remove(@Param('id') id: string, @Request() req) {
        return this.photosService.remove(+id, req.user.profileId);
    }
}
