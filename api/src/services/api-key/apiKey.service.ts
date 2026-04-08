import type { ApiKey, Prisma, PrismaClient } from "@db/client";

const createApiKey = async (
	db: PrismaClient,
	data: Prisma.ApiKeyCreateInput,
) => {
	return await db.apiKey.create({
		data,
	});
};

const findApiKeyById = async (db: PrismaClient, id: string) => {
	return await db.apiKey.findUnique({
		where: {
			id: id,
		},
	});
};

const findApiKeyBySecret = async (db: PrismaClient, secret: string) => {
	return await db.apiKey.findUnique({
		where: {
			secret,
		},
		include: {
			project: true,
		},
	});
};

const updateApiKeyById = async (
	db: PrismaClient,
	id: string,
	data: Prisma.ApiKeyUpdateInput,
) => {
	return await db.apiKey.update({
		where: {
			id,
		},
		data,
	});
};

export default {
	createApiKey,
	findApiKeyById,
	findApiKeyBySecret,
	updateApiKeyById,
};
