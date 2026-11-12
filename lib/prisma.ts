import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Gunakan POSTGRES_PRISMA_URL (Vercel), DATABASE_URL (lokal), atau fallback env lain yang tersedia
const connectionString =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DIRECT_URL;

const createPrismaClient = () => {
  // Prisma 7 mewajibkan PrismaClientOptions berisi adapter / accelerateUrl (tidak boleh kosong)
  const pool = new Pool(connectionString ? { connectionString } : {});
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
