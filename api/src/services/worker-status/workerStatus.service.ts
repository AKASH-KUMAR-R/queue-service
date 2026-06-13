import { type Prisma, type PrismaClient } from "@db/client";
import { getAllAndClear } from "@lib/inMemoryStore.lib";

import { logger } from "@utils/logger.util";
import { prisma } from "@utils/prisma.util";

const WORKER_LAST_SEEN_PREFIX = "worker:lastSeen:";
const WORKER_ACTIVE_JOBS_PREFIX = "worker:activeJobs:";

type WorkerLastSeenSnapshot = {
	lastSeenAt: number;
	queueId: string;
};

type WorkerStatusSnapshot = {
	queueId?: string;
	lastSeenAt?: number;
	activeJobsDelta?: number;
};

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

const findLatestWorkerEvent = async (worker_id: string) => {
	return await prisma.jobEvents.findFirst({
		where: {
			worker_id,
		},
		orderBy: {
			created_at: "desc",
		},
		select: {
			queue_id: true,
			created_at: true,
		},
	});
};

const findByQueueId = async (
	db: PrismaClient | Prisma.TransactionClient,
	queueId: string,
) => {
	return await db.workerStatus.findMany({
		where: {
			queue_id: queueId,
		},
		orderBy: {
			last_seen: "desc",
		},
	});
};

const extractWorkerId = (key: string, prefix: string) => {
	return key.slice(prefix.length);
};

const isWorkerLastSeenSnapshot = (
	value: unknown,
): value is WorkerLastSeenSnapshot => {
	return (
		typeof value === "object" &&
		value !== null &&
		"lastSeenAt" in value &&
		"queueId" in value &&
		typeof value.lastSeenAt === "number" &&
		typeof value.queueId === "string"
	);
};

const getWorkerSnapshots = (): Map<string, WorkerStatusSnapshot> => {
	const workerSnapshots = new Map<string, WorkerStatusSnapshot>();

	const lastSeenEntries = getAllAndClear(WORKER_LAST_SEEN_PREFIX);
	for (const [key, entry] of lastSeenEntries.entries()) {
		if (entry.type !== "value" || !isWorkerLastSeenSnapshot(entry.data)) {
			logger.warn(
				`[worker_status_reconciliation] ignoring invalid last-seen snapshot for key=${key}`,
			);
			continue;
		}

		const workerId = extractWorkerId(key, WORKER_LAST_SEEN_PREFIX);
		workerSnapshots.set(workerId, {
			...(workerSnapshots.get(workerId) ?? {}),
			queueId: entry.data.queueId,
			lastSeenAt: entry.data.lastSeenAt,
		});
	}

	const activeJobEntries = getAllAndClear(WORKER_ACTIVE_JOBS_PREFIX);
	for (const [key, entry] of activeJobEntries.entries()) {
		if (entry.type !== "counter") {
			logger.warn(
				`[worker_status_reconciliation] ignoring invalid active-jobs snapshot for key=${key}`,
			);
			continue;
		}

		const workerId = extractWorkerId(key, WORKER_ACTIVE_JOBS_PREFIX);
		const activeJobsDelta = entry.counts.activeJobs ?? 0;

		workerSnapshots.set(workerId, {
			...(workerSnapshots.get(workerId) ?? {}),
			activeJobsDelta,
		});
	}

	return workerSnapshots;
};

const flushWorkerStatusSnapshots = async () => {
	const workerSnapshots = getWorkerSnapshots();

	for (const [worker_id, snapshot] of workerSnapshots.entries()) {
		const existingWorkerStatus = await prisma.workerStatus.findUnique({
			where: {
				worker_id,
			},
		});

		if (existingWorkerStatus) {
			const updateData: Prisma.WorkerStatusUncheckedUpdateInput = {};

			if (snapshot.queueId) {
				updateData.queue_id = snapshot.queueId;
			}

			if (snapshot.lastSeenAt !== undefined) {
				updateData.last_seen = new Date(snapshot.lastSeenAt);
			}

			if (snapshot.activeJobsDelta !== undefined) {
				updateData.active_jobs = {
					increment: snapshot.activeJobsDelta,
				};
			}

			await prisma.workerStatus.update({
				where: {
					worker_id,
				},
				data: updateData,
			});

			continue;
		}

		const latestWorkerEvent = await findLatestWorkerEvent(worker_id);
		const queueId = snapshot.queueId ?? latestWorkerEvent?.queue_id;
		const lastSeen =
			snapshot.lastSeenAt !== undefined
				? new Date(snapshot.lastSeenAt)
				: latestWorkerEvent?.created_at;

		if (!queueId || !lastSeen) {
			logger.warn(
				`[worker_status_reconciliation] skipping worker_id=${worker_id} because queue_id or last_seen could not be resolved`,
			);
			continue;
		}

		await prisma.workerStatus.create({
			data: {
				worker_id,
				queue_id: queueId,
				last_seen: lastSeen,
				active_jobs:
					snapshot.activeJobsDelta === undefined
						? 0
						: Math.max(snapshot.activeJobsDelta, 0),
			},
		});
	}

	return workerSnapshots.size;
};

export default {
	findByQueueId,
	findLatestWorkerEvent,
	flushWorkerStatusSnapshots,
	upsert,
};
