import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetDatabase() {
  try {
    console.log("Resetting database...");

    // Delete all migration records
    await prisma.$executeRawUnsafe(`DELETE FROM "_prisma_migrations";`);

    // Drop the public schema (deletes all tables and enums)
    await prisma.$executeRawUnsafe(`DROP SCHEMA public CASCADE`);

    // Recreate the schema
    await prisma.$executeRawUnsafe(`CREATE SCHEMA public`);

    console.log("Database reset complete!");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();
