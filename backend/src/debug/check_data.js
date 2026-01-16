
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const jade = await prisma.profile.findUnique({ where: { username: 'jade' } });
    const u111 = await prisma.profile.findUnique({ where: { username: '111' } });

    console.log('--- Jade Photos ---');
    if (jade) {
        const photos = await prisma.photo.findMany({ where: { profileId: jade.id } });
        console.dir(photos, { depth: null });
        const albums = await prisma.album.findMany({ where: { profileId: jade.id } });
        console.dir(albums, { depth: null });
    }

    console.log('\n--- 111 Photos ---');
    if (u111) {
        const photos = await prisma.photo.findMany({ where: { profileId: u111.id } });
        console.dir(photos, { depth: null });
        const albums = await prisma.album.findMany({ where: { profileId: u111.id } });
        console.dir(albums, { depth: null });
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
