import { JobStatus, PrismaClient, type Prisma } from "@prisma/client";

const createJob = async (db: PrismaClient, data: Prisma.JobCreateInput) => {
	return await db.job.create({
		data,
	});
};

const findById = async (db: PrismaClient, id: string) => {
	return await db.job.findUnique({
		where: {
			id,
		},
	});
};

const findNextJob = async (db: PrismaClient, queue_id: string) => {
	return await db.$transaction(async (tx) => {
		const nextJob = await tx.job.findFirst({
			where: {
				queue_id,
				status: JobStatus.PENDING,
				attempts: {
					lt: 5,
				},
			},
			orderBy: {
				created_at: "asc",
			},
		});

		if (!nextJob) {
			return null;
		}

		const updatedJob = await tx.job.update({
			where: {
				id: nextJob.id,
			},
			data: {
				status: JobStatus.IN_PROGRESS,
				attempts: {
					increment: 1,
				},
			},
		});

		return updatedJob;
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

const updateStatusAsCompleted = async (db: PrismaClient, id: string) => {
	return await db.job.update({
		where: {
			id,
		},
		data: {
			status: JobStatus.COMPLETED,
		},
	});
};

const updateStatusAsFailed = async (db: PrismaClient, id: string) => {
	return await db.job.update({
		where: {
			id,
		},
		data: {
			status: JobStatus.FAILED,
		},
	});
};

export default {
	createJob,
	findById,
	findNextJob,
	updateById,
	updateStatusAsCompleted,
	updateStatusAsFailed,
};
