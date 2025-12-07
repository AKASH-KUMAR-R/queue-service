import type { PrismaClient } from "@prisma/client";

const getProjectById = async (db: PrismaClient, id: string) => {
	return await db.project.findUnique({
		where: { id },
	});
};

export default {
	getProjectById,
};
