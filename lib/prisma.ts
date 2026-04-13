import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Gunakan DATABASE_URL (lokal) atau POSTGRES_PRISMA_URL (Vercel)
const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

const createPrismaClient = () => {
  if (connectionString) {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
  // Fallback ke default behavior Prisma
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
