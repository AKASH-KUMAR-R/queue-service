import type { Prisma, PrismaClient } from "@prisma/client";

const create = async (
	db: PrismaClient,
	data: Prisma.ProjectUncheckedCreateInput,
) => {
	const enhancedData: Prisma.ProjectCreateInput = {
		label: data.label,
		description: data.description || null,
		user: {
			connect: {
				id: data.user_id,
			},
		},
	};
	return await db.project.create({
		data: enhancedData,
	});
};

const getProjectById = async (db: PrismaClient, id: string) => {
	return await db.project.findUnique({
		where: { id },
	});
};

export default {
	create,
	getProjectById,
};
