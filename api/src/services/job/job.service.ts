import {
	type Job,
	JobEventType,
	JobStatus,
	type Prisma,
	PrismaClient,
} from "@prisma/client";

import jobEventsService from "@services/job-events/jobEvents.service";
import queueService from "@services/queue/queue.service";

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
		const job: Job[] = await tx.$queryRaw`
			UPDATE "Job"
			SET status = ${JobStatus.IN_PROGRESS}::"JobStatus",
				attempts = attempts + 1,
				started_at = (NOW() AT TIME ZONE 'UTC'),
				heartbeated_at = (NOW() AT TIME ZONE 'UTC')
			WHERE id = (
				SELECT id FROM "Job"
				WHERE queue_id = ${queue_id} AND status = ${JobStatus.PENDING}::"JobStatus" AND attempts < 5 AND (scheduled_at IS NULL OR scheduled_at <= NOW())
				ORDER BY "priority" ASC, "created_at" ASC
				FOR UPDATE SKIP LOCKED
				LIMIT 1
			)
			RETURNING *;
		`;

		console.log("Acquired Job:", job);
		if (!job[0]) return null;

		const queue = await queueService.findById(tx, queue_id);

		if (!queue) {
			throw new Error("Queue not found");
		}

		await jobEventsService.createJobEvent(tx, {
			project_id: queue.project_id,
			queue_id: job[0].queue_id,
			job_id: job[0].id,
			event_type: JobEventType.JOB_ACQUIRED,
			prev_status: JobStatus.PENDING,
			next_status: JobStatus.IN_PROGRESS,
		});

		return job[0];
	});
};

const updateById = async (
	db: PrismaClient,
	id: string,
	updatedData: Prisma.JobUpdateInput,
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
