import { JobStatus, PrismaClient, type Job, type Prisma } from "@prisma/client";

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

// TODO: Implement locking mechanism to prevent race conditions
const findNextJob = async (db: PrismaClient, queue_id: string) => {
	return await db.$transaction(async (tx) => {
		const job: Job[] = await tx.$queryRaw`
			UPDATE "Job"
			SET status = 'IN_PROGRESS',
				attempts = attempts + 1
			WHERE id = (
				SELECT id FROM "Job"
				WHERE queue_id = ${queue_id} AND status = 'PENDING' AND attempts < 5
				ORDER BY "created_at" ASC
				FOR UPDATE SKIP LOCKED
				LIMIT 1
			)
			RETURNING *;
		`;

		return job[0] ?? null;
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
