
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDelete() {
    const photoId = 12; // Jade's base64 photo
    const profileId = '12a44d3c-728b-4154-be67-6b3a7850a8e7'; // Jade's profile ID

    console.log(`Attempting to delete photo ${photoId} for profile ${profileId}...`);

    try {
        const photo = await prisma.photo.findUnique({
            where: { id: photoId },
        });

        if (!photo) {
            console.log('Photo not found in DB');
            return;
        }

        if (photo.profileId !== profileId) {
            console.error('Permission denied: expected', photo.profileId, 'got', profileId);
            return;
        }

        console.log('Photo found, current URL:', photo.url);

        // Simulate the removal logic in PhotosService
        await prisma.photo.delete({
            where: { id: photoId },
        });
        console.log('Database record deleted successfully');

    } catch (error) {
        console.error('Delete failed:', error);
    }
}

testDelete()
    .finally(async () => await prisma.$disconnect());
