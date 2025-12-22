import type { Prisma, PrismaClient } from "@prisma/client";

const createJobEvent = async (
	db: PrismaClient | Prisma.TransactionClient,
	data: Prisma.JobEventsUncheckedCreateInput,
) => {
	const enforcedData: Prisma.JobEventsCreateInput = {
		project: {
			connect: { id: data.project_id },
		},
		job: {
			connect: { id: data.job_id },
		},
		queue: {
			connect: { id: data.queue_id },
		},
		event_type: data.event_type,
		prev_status: data.prev_status,
		next_status: data.next_status,
	};

	if (data.metadata) {
		enforcedData.metadata = data.metadata;
	}

	return await db.jobEvents.create({
		data: enforcedData,
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

export default {
	createJobEvent,
	findById,
};
