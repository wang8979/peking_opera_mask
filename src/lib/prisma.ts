import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
    // 在Prisma 7中使用client引擎类型时需要配置adapter
// 如需使用自定义适配器，请确保已正确安装并导入对应驱动，例如：
// import { PrismaPg } from '@prisma/adapter-pg'
// adapter: new PrismaPg(pool)
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;