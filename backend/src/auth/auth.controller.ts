import { Body, Controller, Post, Req, UseGuards, Headers } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * 用户注册
     */
    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    /**
     * 用户登录
     */
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    /**
     * 用户登出
     */
    @Post('logout')
    @UseGuards(AuthGuard)
    async logout(@Headers('authorization') authorization: string) {
        const token = authorization?.split(' ')[1];
        return this.authService.logout(token);
    }

    /**
     * 同步用户资料
     */
    @Post('sync-profile')
    @UseGuards(AuthGuard)
    async syncProfile(@Req() req, @Body() body: any) {
        return this.authService.syncProfile(req.user, body);
    }
}
