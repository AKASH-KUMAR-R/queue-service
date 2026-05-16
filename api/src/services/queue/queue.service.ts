import { Prisma, type PrismaClient, type Queue } from "@db/client";

import type { QueueFilters } from "@models/queue/requests/QueueSearchRequest";

import queueMetricsService from "@services/queue-metrics/queueMetrics.service";

import { PaginationParams, PaginationResults } from "@utils/pagination.util";

const createQueue = async (
	db: PrismaClient,
	data: Prisma.QueueUncheckedCreateInput,
	queueLimiter?: Prisma.QueueRateLimiterUncheckedCreateWithoutQueueInput,
) => {
	const enrichedData: Prisma.QueueCreateInput = {
		label: data.label,
		description: data.description || null,
		rate_limit_count: data.rate_limit_count || null,
		rate_limit_window_ms: data.rate_limit_window_ms || null,
		project: {
			connect: { id: data.project_id },
		},
		environment: {
			connect: { id: data.environment_id },
		},
	};

	if (queueLimiter) {
		enrichedData.queueRateLimiter = {
			create: {
				job_count: queueLimiter.job_count || 0,
			},
		};
	}

	return await db.$transaction(async (tx) => {
		const newQueue = await tx.queue.create({
			data: enrichedData,
		});

		await queueMetricsService.create(tx, { queue_id: newQueue.id });

		return newQueue;
	});
};

const findById = async (
	db: PrismaClient | Prisma.TransactionClient,
	id: string,
) => {
	return await db.queue.findUnique({
		where: {
			id,
		},
	});
};

const findByLabel = async (
	db: PrismaClient,
	label: string,
	project_id: string,
	environment_id: string,
) => {
	return await db.queue.findUnique({
		where: {
			project_id_label: {
				project_id,
				label,
			},
			environment_id,
		},
	});
};

const findByLabelWithQueueLimiter = async (
	db: PrismaClient,
	label: string,
	project_id: string,
) => {
	return await db.queue.findUnique({
		where: {
			project_id_label: {
				project_id,
				label,
			},
		},
		include: {
			queueRateLimiter: true,
		},
	});
};

const findByIdWithQueueLimiter = async (
	db: PrismaClient | Prisma.TransactionClient,
	id: string,
) => {
	return await db.queue.findUnique({
		where: {
			id,
		},
		include: {
			queueRateLimiter: true,
		},
	});
};

const findQueues = async (
	db: PrismaClient,
	query: QueueFilters,
	page: number,
	limit: number,
) => {
	const paginationParams = new PaginationParams(page, limit);
	const trimmedLabel = query.label?.trim();

	const whereQuery: Prisma.QueueWhereInput = {
		...(trimmedLabel && {
			label: { contains: trimmedLabel, mode: "insensitive" },
		}),
		...(query.status && { status: query.status }),
		...(query.project_id && { project_id: query.project_id }),
		...(query.environment_id && { environment_id: query.environment_id }),
	};

	const results = await db.queue.findMany({
		where: whereQuery,
		orderBy: {
			created_at: "desc",
		},
		include: {
			queue_metrics: true,
		},
		take: paginationParams.limit,
		skip: paginationParams.offset,
	});

	const count = await db.queue.count({
		where: whereQuery,
	});

	return new PaginationResults(results, page, limit, count);
};

const updateById = async (
	db: PrismaClient,
	id: string,
	updatedData: Partial<Queue>,
) => {
	return await db.queue.update({
		where: {
			id,
		},
		data: updatedData,
	});
};

const deleteQueue = async (db: PrismaClient, id: string) => {
	return await db.queue.delete({
		where: {
			id,
		},
	});
};

export default {
	createQueue,
	findById,
	findByLabel,
	findQueues,
	findByLabelWithQueueLimiter,
	findByIdWithQueueLimiter,
	updateById,
	deleteQueue,
};
