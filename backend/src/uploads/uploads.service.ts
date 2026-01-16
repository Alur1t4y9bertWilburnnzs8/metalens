import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly prisma: PrismaService,
    ) { }

    async uploadPhoto(user: any, file: Express.Multer.File, body: any) {
        const bucket = 'metalens-assets';
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        const thumbPath = `${user.id}/thumb_${fileName}`;

        // 1. Get image metadata
        const metadata = await sharp(file.buffer).metadata();

        // 2. Resize for thumbnail
        const thumbnailBuffer = await sharp(file.buffer)
            .resize(400)
            .toBuffer();

        // 3. Upload Original
        const { error: uploadError } = await this.supabaseService
            .getClient()
            .storage.from(bucket)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (uploadError) throw uploadError;

        // 4. Upload Thumbnail
        const { error: thumbError } = await this.supabaseService
            .getClient()
            .storage.from(bucket)
            .upload(thumbPath, thumbnailBuffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (thumbError) throw thumbError;

        // 5. Get Public URLs
        const { data: { publicUrl: url } } = this.supabaseService
            .getClient()
            .storage.from(bucket)
            .getPublicUrl(filePath);

        const { data: { publicUrl: thumbnailUrl } } = this.supabaseService
            .getClient()
            .storage.from(bucket)
            .getPublicUrl(thumbPath);

        // 6. Save to DB
        const profile = await this.prisma.profile.findUnique({
            where: { userId: user.id },
        });

        if (!profile) throw new Error('Profile not found');

        let albumId = parseInt(body.albumId);
        if (!albumId) {
            throw new Error('Album ID required');
        }

        // Parse metadata if it's sent as a JSON string
        let photoMetadata = body.metadata;
        if (typeof photoMetadata === 'string') {
            try {
                photoMetadata = JSON.parse(photoMetadata);
            } catch (e) {
                console.error('Error parsing metadata JSON:', e);
                photoMetadata = {};
            }
        }

        const photo = await this.prisma.photo.create({
            data: {
                profileId: profile.id,
                albumId: albumId,
                url: url,
                thumbnailUrl: thumbnailUrl,
                title: body.title || 'Untitled',
                isPublic: body.isPublic === 'true',
                width: metadata.width || 0,
                height: metadata.height || 0,
                metadata: photoMetadata || {},
            },
        });

        return photo;
    }

    async uploadAvatar(user: any, file: Express.Multer.File) {
        const bucket = 'metalens-assets';
        const fileExt = file.originalname.split('.').pop();
        const fileName = `avatars/${user.id}_${Date.now()}.${fileExt}`;

        // Resize avatar to square
        const buffer = await sharp(file.buffer)
            .resize(200, 200, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .toBuffer();

        const { error: uploadError } = await this.supabaseService
            .getClient()
            .storage.from(bucket)
            .upload(fileName, buffer, {
                contentType: file.mimetype,
                upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = this.supabaseService
            .getClient()
            .storage.from(bucket)
            .getPublicUrl(fileName);

        return { url: publicUrl };
    }
}
