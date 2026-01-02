import type { Prisma, PrismaClient } from "@prisma/client";

import { PaginationParams, PaginationResults } from "@utils/pagination.util";

const createJobEvent = async (
	db: PrismaClient | Prisma.TransactionClient,
	data: Prisma.JobEventsUncheckedCreateInput,
) => {
	const enrichedData: Prisma.JobEventsCreateInput = {
		project: {
			connect: { id: data.project_id },
		},
		job: {
			connect: { id: data.job_id },
		},
		queue: {
			connect: { id: data.queue_id },
		},
		worker_id: data.worker_id,
		event_type: data.event_type,
		prev_status: data.prev_status,
		next_status: data.next_status,
	};

	if (data.metadata) {
		enrichedData.metadata = data.metadata;
	}

	return await db.jobEvents.create({
		data: enrichedData,
	});
};

const findById = async (db: PrismaClient, id: string) => {
	return await db.jobEvents.findUnique({
		where: {
			id,
		},
		include: {
			job: true,
		},
	});
};

const findByJobId = async (
	db: PrismaClient,
	jobId: string,
	page: number,
	limit: number,
) => {
	const paginatedParams = new PaginationParams(page, limit);

	const results = await db.jobEvents.findMany({
		where: {
			job_id: jobId,
		},
		orderBy: {
			created_at: "desc",
		},
		skip: paginatedParams.offset,
		take: paginatedParams.limit,
	});

	const count = await db.jobEvents.count({
		where: {
			job_id: jobId,
		},
	});

	return new PaginationResults(results, page, limit, count);
};

export default {
	createJobEvent,
	findById,
	findByJobId,
};
