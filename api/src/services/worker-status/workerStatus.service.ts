import type { Prisma, PrismaClient } from "@prisma/client";

const upsert = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		update: Prisma.WorkerStatusUpsertArgs["update"];
		create: Prisma.WorkerStatusUpsertArgs["create"];
	},
) => {
	return await db.workerStatus.upsert({
		create: data.create,
		update: data.update,
		where: {
			worker_id,
		},
	});
};

const upsertForJobAcquired = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		queue_id: string;
	},
) => {
	const create: Prisma.WorkerStatusUncheckedCreateInput = {
		worker_id,
		queue_id: data.queue_id,
		last_seen: new Date(),
		active_jobs: 1,
	};

	const update: Prisma.WorkerStatusUncheckedUpdateInput = {
		active_jobs: {
			increment: 1,
		},
		last_seen: new Date(),
	};

	return await db.workerStatus.upsert({
		create,
		update,
		where: {
			worker_id,
		},
	});
};

const upsertForJobReleased = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		queue_id: string;
	},
) => {
	const create: Prisma.WorkerStatusUncheckedCreateInput = {
		worker_id,
		queue_id: data.queue_id,
		last_seen: new Date(),
	};

	const update: Prisma.WorkerStatusUncheckedUpdateInput = {
		active_jobs: {
			decrement: 1,
		},
		last_seen: new Date(),
	};

	return await db.workerStatus.upsert({
		create,
		update,
		where: {
			worker_id,
		},
	});
};

const upsertForHeartbeat = async (
	db: PrismaClient | Prisma.TransactionClient,
	worker_id: string,
	data: {
		queue_id: string;
	},
) => {
	return await db.workerStatus.upsert({
		create: {
			queue_id: data.queue_id,
			worker_id,
			last_seen: new Date(),
			active_jobs: 0,
		},
		update: {
			last_seen: new Date(),
		},
		where: {
			worker_id: worker_id,
		},
	});
};

export default {
	upsert,
	upsertForHeartbeat,
	upsertForJobAcquired,
	upsertForJobReleased,
};
