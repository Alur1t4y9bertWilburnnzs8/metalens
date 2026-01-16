import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UploadsModule } from './uploads/uploads.module';
import { CommunityModule } from './community/community.module';
import { SupabaseModule } from './supabase/supabase.module';
import { AlbumsModule } from './albums/albums.module';
import { PhotosModule } from './photos/photos.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        SupabaseModule,
        AuthModule,
        UploadsModule,
        CommunityModule,
        AlbumsModule,
        PhotosModule,
        UsersModule,
        NotificationsModule,
    ],
})
export class AppModule { }

