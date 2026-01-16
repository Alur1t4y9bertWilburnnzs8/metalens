import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const { data: { user }, error } = await this.supabaseService.getClient().auth.getUser(token);

            if (error || !user) {
                console.error('Supabase auth error:', error);
                throw new UnauthorizedException('Invalid token');
            }

            // 获取对应的 Profile ID
            try {
                const profile = await this.prisma.profile.findUnique({
                    where: { userId: user.id },
                });

                request['user'] = {
                    ...user,
                    profileId: profile?.id,
                };
            } catch (dbError) {
                console.error('Database profile lookup failed:', dbError);
                // Database errors should NOT be 401, otherwise the user gets logged out!
                // We'll attach the user but warn that profile is missing
                request['user'] = { ...user, profileId: null };
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            console.error('Unexpected auth check failure:', error);
            throw new UnauthorizedException('Authentication process failed');
        }
        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}

@Injectable()
export class OptionalAuthGuard extends AuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            await super.canActivate(context);
            return true;
        } catch (e) {
            // Confirm exception is due to missing token
            // Log it but allow request to proceed without user
            // console.log('OptionalAuthGuard: Request proceeded without auth');
            return true;
        }
    }
}
