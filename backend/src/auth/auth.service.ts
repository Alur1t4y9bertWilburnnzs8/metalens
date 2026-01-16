import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private supabase: SupabaseService,
    ) { }

    /**
     * 用户注册
     */
    async signUp(signUpDto: SignUpDto) {
        const { email, password, username } = signUpDto;

        // 使用 Supabase Auth 注册用户
        const { data, error } = await this.supabase.getClient().auth.signUp({
            email,
            password,
        });

        if (error) {
            throw new Error(`注册失败: ${error.message}`);
        }

        if (!data.user) {
            throw new Error('注册失败');
        }

        // 在数据库中创建 Profile
        const profile = await this.prisma.profile.create({
            data: {
                userId: data.user.id,
                username,
            },
        });

        return {
            user: data.user,
            session: data.session,
            profile,
        };
    }

    /**
     * 用户登录
     */
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        console.log(`[AuthService] Attempting login for email: ${email}`);

        // 使用 Supabase Auth 登录
        const { data, error } = await this.supabase.getClient().auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error(`[AuthService] Login error from Supabase: ${error.message}`);
            throw new UnauthorizedException(`登录失败: ${error.message}`);
        }

        if (!data.user || !data.session) {
            throw new UnauthorizedException('登录失败');
        }

        // 获取或创建 Profile
        let profile = await this.prisma.profile.findUnique({
            where: { userId: data.user.id },
        });

        if (!profile) {
            // 如果 Profile 不存在，创建一个（兼容老用户）
            let username = email.split('@')[0];

            // 检查用户名是否冲突
            const existingProfile = await this.prisma.profile.findUnique({
                where: { username },
            });

            if (existingProfile) {
                // 如果冲突，加上随机后缀
                username = `${username}_${Math.random().toString(36).slice(2, 6)}`;
            }

            try {
                profile = await this.prisma.profile.create({
                    data: {
                        userId: data.user.id,
                        username: username,
                    },
                });
            } catch (createError) {
                console.error('Failed to auto-create profile on login:', createError);
                // Fallback to finding it again in case of race condition
                profile = await this.prisma.profile.findUnique({
                    where: { userId: data.user.id },
                });
                if (!profile) throw new Error('无法初始化用户信息，请联系管理员');
            }
        }

        return {
            user: data.user,
            session: data.session,
            profile,
            accessToken: data.session.access_token,
        };
    }

    /**
     * 登出
     */
    async logout(token: string) {
        const { error } = await this.supabase.getClient().auth.signOut();

        if (error) {
            throw new Error(`登出失败: ${error.message}`);
        }

        return { message: '登出成功' };
    }

    /**
     * 同步用户资料（已有接口）
     */
    async syncProfile(user: any, body: any) {
        const { id, email } = user;

        // 检查 Profile 是否存在
        let profile = await this.prisma.profile.findUnique({
            where: { userId: id },
        });

        if (!profile) {
            // 创建新的 Profile
            profile = await this.prisma.profile.create({
                data: {
                    userId: id,
                    username: body.username || email.split('@')[0],
                    avatarUrl: body.avatarUrl,
                    bio: body.bio,
                },
            });
        }

        // 获取统计数据
        const [photosCount, followersCount, followingCount] = await Promise.all([
            this.prisma.photo.count({ where: { profileId: profile.id } }),
            this.prisma.follow.count({ where: { followingId: profile.id } }),
            this.prisma.follow.count({ where: { followerId: profile.id } }),
        ]);

        return {
            profile,
            stats: {
                works: photosCount,
                followers: followersCount,
                following: followingCount,
            },
        };
    }
}
