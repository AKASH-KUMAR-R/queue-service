import type { Job, Prisma, PrismaClient } from "@prisma/client";

const createJob = async (db: PrismaClient, data: Prisma.JobCreateInput) => {
	return await db.job.create({
		data: data,
	});
};

const findById = async (db: PrismaClient, id: string) => {
	return await db.job.findUnique({
		where: {
			id,
		},
	});
};

const updateById = async (
	db: PrismaClient,
	id: string,
	updatedData: Prisma.JobUpdateInput
) => {
	return await db.job.update({
		where: {
			id,
		},
		data: updatedData,
	});
};

export default {
	createJob,
	findById,
	updateById,
};
