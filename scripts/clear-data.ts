import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
    try {
        console.log('🗑️  Starting database cleanup...\n');
        console.log('⚠️  This will delete ALL data from your database!\n');

        // Delete all data using transactions
        await prisma.$transaction([
            prisma.orderItem.deleteMany({}),
            prisma.order.deleteMany({}),
            prisma.product.deleteMany({}),
            prisma.user.deleteMany({}),
        ]);

        console.log('✅ All data deleted successfully!\n');
        console.log('Summary:');
        console.log('- OrderItems: Deleted');
        console.log('- Orders: Deleted');
        console.log('- Products: Deleted');
        console.log('- Users: Deleted');
        console.log('\n✨ Database is now empty and ready for fresh data.\n');

    } catch (error: any) {
        console.error('❌ Error clearing database:', error.message);
        console.log('\n💡 Tip: Make sure your dev server is stopped before running this script.');
        console.log('Run: Stop the "npm run dev" process, then try again.\n');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

clearAllData();
