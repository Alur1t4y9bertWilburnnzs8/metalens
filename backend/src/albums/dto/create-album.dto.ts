import { IsString, IsIn, IsOptional } from 'class-validator';

/**
 * 创建相册的 DTO
 */
export class CreateAlbumDto {
    @IsString()
    title: string;

    @IsIn(['photo', 'ai', 'paint'])
    type: 'photo' | 'ai' | 'paint';

    @IsOptional()
    @IsString()
    coverUrl?: string;
}
