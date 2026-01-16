
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConstraints() {
    const jade = await prisma.profile.findUnique({ where: { username: 'jade' } });
    if (!jade) return;

    const photos = await prisma.photo.findMany({
        where: { profileId: jade.id },
        include: { _count: { select: { likes: true } } }
    });

    console.log('--- Jade Photos with Like counts ---');
    photos.forEach(p => {
        console.log(`ID: ${p.id}, Title: ${p.title}, Likes: ${p._count.likes}`);
    });
}

checkConstraints()
    .finally(async () => await prisma.$disconnect());
