import type { Prisma, PrismaClient, Queue } from "@prisma/client";

const createQueue = async (
	db: PrismaClient,
	data: Prisma.QueueUncheckedCreateInput,
	queueLimiter?: Prisma.QueueRateLimiterUncheckedCreateWithoutQueueInput,
) => {
	const newQueue: Prisma.QueueCreateInput = {
		label: data.label,
		description: data.description || null,
		rate_limit_count: data.rate_limit_count || null,
		rate_limit_window_ms: data.rate_limit_window_ms || null,
		project: {
			connect: { id: data.project_id },
		},
	};

	if (queueLimiter) {
		newQueue.queueRateLimiter = {
			create: {
				job_count: queueLimiter.job_count || 0,
			},
		};
	}

	return await db.queue.create({
		data: newQueue,
	});
};

const findById = async (db: PrismaClient, id: string) => {
	return await db.queue.findUnique({
		where: {
			id,
		},
	});
};

const findByLabel = async (db: PrismaClient, label: string) => {
	return await db.queue.findUnique({
		where: {
			label,
		},
	});
};

const findByLabelWithQueueLimiter = async (db: PrismaClient, label: string) => {
	return await db.queue.findUnique({
		where: {
			label,
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
	updateById,
	deleteQueue,
};
