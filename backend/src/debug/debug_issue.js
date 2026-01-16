
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DEBUG START ---');

    // 1. Find Profiles directly
    const profile111 = await prisma.profile.findUnique({ where: { username: '111' } });
    const profileJade = await prisma.profile.findUnique({ where: { username: 'jade' } });

    if (!profile111 || !profileJade) {
        console.log('Profiles not found');
        return;
    }

    console.log(`Profile 111: ${profile111.id}`);
    console.log(`Profile Jade: ${profileJade.id}`);

    // 2. Check "书法" photo of 111
    // Assuming title contains "书法" or we list recent photos
    const photos111 = await prisma.photo.findMany({
        where: { profileId: profile111.id },
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log('\n--- Photos of 111 ---');
    photos111.forEach(p => {
        console.log(`ID: ${p.id}, Title: ${p.title}, IsPublic: ${p.isPublic}`);
    });

    // 3. Check Notifications for 111
    const notifs111 = await prisma.notification.findMany({
        where: { profileId: profile111.id },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    console.log('\n--- Notifications for 111 ---');
    notifs111.forEach(n => {
        console.log(`ID: ${n.id}, Type: ${n.type}, Actor: ${n.actorId}, Target: ${n.targetId}, Content: ${n.content}`);
        // Check if targetId matches any photo
        const match = photos111.find(p => p.id.toString() === n.targetId);
        if (match) console.log(`   -> Matches Photo: ${match.title}`);
        else console.log(`   -> NO MATCH in recent photos`);
    });

    // 4. Check Follow Status: 111 follows Jade?
    const follow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: profile111.id,
                followingId: profileJade.id
            }
        }
    });

    console.log('\n--- Follow Status ---');
    console.log(`111 follows Jade? ${!!follow}`);

    // 5. Check if Jade liked "书法" (assuming looking for latest liked)
    // We need to know which photo is "书法". Let's assume it's one of the photos111.
    console.log('\n--- Likes by Jade on 111s photos ---');
    for (const p of photos111) {
        const like = await prisma.like.findUnique({
            where: {
                profileId_photoId: {
                    profileId: profileJade.id,
                    photoId: p.id
                }
            }
        });
        if (like) console.log(`Jade liked photo ${p.id} (${p.title})`);
    }

    console.log('--- DEBUG END ---');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
