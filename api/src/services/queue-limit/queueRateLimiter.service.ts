import type { Prisma, PrismaClient } from "@db/client";

const createQueueLimiter = async (
	db: PrismaClient,
	data: Prisma.QueueRateLimiterCreateInput,
) => {
	const result = await db.queueRateLimiter.create({
		data,
	});
	return result;
};

const findQueueLimiterById = async (db: PrismaClient, id: string) => {
	const result = await db.queueRateLimiter.findUnique({
		where: { id },
	});
	return result;
};

const findQueueLimiterByQueueId = async (db: PrismaClient, queueId: string) => {
	const result = await db.queueRateLimiter.findUnique({
		where: { queue_id: queueId },
	});
	return result;
};

const findQueueLimiterByIdAndUpdate = async (
	db: PrismaClient,
	id: string,
	data: Prisma.QueueRateLimiterUpdateInput,
) => {
	const result = await db.queueRateLimiter.update({
		where: { id },
		data,
	});
	return result;
};

const queueRateLimitExpired = async (db: PrismaClient, id: string) => {
	const result = await db.queueRateLimiter.update({
		where: { id },
		data: {
			last_reset_at: new Date(),
			job_count: 0,
		},
	});

	return result;
};

const incQueueRateLimitCounter = async (
	db: PrismaClient | Prisma.TransactionClient,
	id: string,
) => {
	const result = await db.queueRateLimiter.update({
		where: { id },
		data: {
			job_count: {
				increment: 1,
			},
		},
	});

	return result;
};

export default {
	createQueueLimiter,
	findQueueLimiterById,
	findQueueLimiterByQueueId,
	findQueueLimiterByIdAndUpdate,
	queueRateLimitExpired,
	incQueueRateLimitCounter,
};
