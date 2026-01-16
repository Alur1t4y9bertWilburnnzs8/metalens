import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private supabase: SupabaseClient;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        this.supabase = createClient(
            this.configService.get<string>('SUPABASE_URL') || '',
            this.configService.get<string>('SUPABASE_KEY') || '',
        );
    }

    getClient(): SupabaseClient {
        return this.supabase;
    }

    /**
     * 从 Supabase 公共 URL 中提取存储路径
     * @param url 公共 URL
     * @returns 存储路径 (不包含 bucket 名)
     */
    extractPathFromUrl(url: string): string | null {
        try {
            if (!url) return null;
            // 正常的 Supabase 公共 URL 格式:
            // https://[project-id].supabase.co/storage/v1/object/public/[bucket-name]/[path]
            const parts = url.split('/storage/v1/object/public/');
            if (parts.length < 2) return null;

            const pathWithBucket = parts[1];
            const firstSlashIndex = pathWithBucket.indexOf('/');
            if (firstSlashIndex === -1) return null;

            return pathWithBucket.substring(firstSlashIndex + 1);
        } catch (e) {
            return null;
        }
    }
}
