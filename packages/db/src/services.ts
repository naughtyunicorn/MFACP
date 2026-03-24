import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    const count = await prisma.user.count();
    console.log(`📊 Database contains ${count} users`);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export { prisma };
