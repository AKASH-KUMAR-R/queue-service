import type { PrismaClient, Queue } from "@prisma/client";

const createQueue = async (db: PrismaClient, data: Queue) => {
	return await db.queue.create({
		data,
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

const updateById = async (
	db: PrismaClient,
	id: string,
	updatedData: Partial<Queue>
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
	updateById,
	deleteQueue,
};
