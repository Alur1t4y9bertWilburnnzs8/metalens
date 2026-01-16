import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    Req,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';
import { UploadsService } from './uploads.service';

@Controller('upload')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        return this.uploadsService.uploadPhoto(req.user, file, body);
    }

    @UseGuards(AuthGuard)
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @Req() req,
        @UploadedFile() file: Express.Multer.File,
    ) {
        console.log('UploadAvatar called');
        console.log('User:', req.user);
        console.log('File:', file ? file.originalname : 'UNDEFINED');
        if (!file) throw new Error('No file uploaded');
        return this.uploadsService.uploadAvatar(req.user, file);
    }
}
