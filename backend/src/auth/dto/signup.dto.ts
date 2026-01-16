import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * 注册 DTO
 */
export class SignUpDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    username: string;
}
