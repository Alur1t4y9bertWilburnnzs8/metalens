import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    try {
        const notifications = await prisma.notification.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' }
        });
        console.log('--- NOTIFICATIONS ---');
        console.log(JSON.stringify(notifications, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
