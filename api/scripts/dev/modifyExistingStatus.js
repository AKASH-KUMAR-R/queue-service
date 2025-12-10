import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

const modifyExistingStatus = async () => {
  try {
    const result = await prisma.queue.updateMany({
      where: {
        status: "QUEUED",
      },
      data: {
        status: "ACTIVE",
      },
    });

    console.log(`Modified ${result.count} records from QUEUED to ACTIVE.`);
  } catch (error) {
    console.error("Error modifying existing status:", error);
  } finally {
    await prisma.$disconnect();
  }
};

modifyExistingStatus();
