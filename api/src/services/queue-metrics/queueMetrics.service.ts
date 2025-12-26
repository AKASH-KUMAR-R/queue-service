import type { Prisma, PrismaClient } from "@prisma/client";

const create = async (
	db: PrismaClient | Prisma.TransactionClient,
	data: Prisma.QueueMetricsUncheckedCreateInput,
) => {
	const enrichedData: Prisma.QueueMetricsCreateInput = {
		queue: {
			connect: {
				id: data.queue_id,
			},
		},
	};

	return await db.queueMetrics.create({
		data: enrichedData,
	});
};

const incCompletedMetric = async (
	db: PrismaClient | Prisma.TransactionClient,
	queue_id: string,
) => {
	return await db.queueMetrics.update({
		where: {
			queue_id,
		},
		data: {
			completed_jobs: {
				increment: 1,
			},
			active_jobs: {
				decrement: 1,
			},
		},
	});
};

const incFailedMetric = async (
	db: PrismaClient | Prisma.TransactionClient,
	queue_id: string,
) => {
	return await db.queueMetrics.update({
		where: {
			queue_id,
		},
		data: {
			failed_jobs: {
				increment: 1,
			},
			active_jobs: {
				decrement: 1,
			},
		},
	});
};

const incActiveMetric = async (
	db: PrismaClient | Prisma.TransactionClient,
	queue_id: string,
) => {
	return await db.queueMetrics.update({
		where: {
			queue_id,
		},
		data: {
			active_jobs: {
				increment: 1,
			},
		},
	});
};

const decActiveMetric = async (
	db: PrismaClient | Prisma.TransactionClient,
	queue_id: string,
) => {
	return await db.queueMetrics.update({
		where: {
			queue_id,
		},
		data: {
			active_jobs: {
				decrement: 1,
			},
		},
	});
};

export default {
	create,
	incActiveMetric,
	decActiveMetric,
	incCompletedMetric,
	incFailedMetric,
};
