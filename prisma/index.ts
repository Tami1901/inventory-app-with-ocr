import { PrismaClient } from "@prisma/client";

const prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

const db = prismaGlobal.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = db;
}

export default db;
