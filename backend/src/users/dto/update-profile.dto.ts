import { IsString, IsOptional } from 'class-validator';

/**
 * 更新用户资料的 DTO
 */
export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    role?: string;
}
