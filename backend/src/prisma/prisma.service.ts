import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    async onModuleInit() {
        let retries = 5;
        while (retries > 0) {
            try {
                await this.$connect();
                console.log('[PrismaService] Successfully connected to database');
                return;
            } catch (err) {
                retries--;
                console.error(`[PrismaService] Failed to connect to database. Retries left: ${retries}. Error: ${err.message}`);
                if (retries === 0) throw err;
                // Wait for 3 seconds before retrying
                await new Promise(res => setTimeout(res, 3000));
            }
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
