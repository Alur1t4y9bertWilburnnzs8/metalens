import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * 登录 DTO
 */
export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}
