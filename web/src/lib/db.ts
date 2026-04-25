import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient; pgPool: Pool };

if (!globalForPrisma.pgPool) {
  globalForPrisma.pgPool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg(globalForPrisma.pgPool),
  });

// احفظ الـ instance في جميع البيئات لتجنب إنشاء pool جديد مع كل request
globalForPrisma.prisma = db;
