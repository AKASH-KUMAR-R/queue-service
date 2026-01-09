import { Prisma, type PrismaClient, type Queue } from "@prisma/client";

import queueMetricsService from "@services/queue-metrics/queueMetrics.service";

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
) => {
	return await db.queue.findUnique({
		where: {
			project_id_label: {
				project_id,
				label,
			},
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
	findByLabelWithQueueLimiter,
	findByIdWithQueueLimiter,
	updateById,
	deleteQueue,
};
