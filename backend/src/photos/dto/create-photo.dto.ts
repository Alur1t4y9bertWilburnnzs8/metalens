import { IsString, IsBoolean, IsInt, IsOptional, IsObject } from 'class-validator';

/**
 * 创建照片的 DTO
 */
export class CreatePhotoDto {
    @IsInt()
    albumId: number;

    @IsString()
    url: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsInt()
    width?: number;

    @IsOptional()
    @IsInt()
    height?: number;

    @IsOptional()
    @IsObject()
    metadata?: any;
}
