import type { ApiKey, Prisma, PrismaClient } from "@prisma/client";

const createApiKey = async (
	db: PrismaClient,
	data: Prisma.ApiKeyCreateInput
) => {
	return await db.apiKey.create({
		data,
	});
};

const findApiKeyById = async (db: PrismaClient, key: string) => {
	return await db.apiKey.findUnique({
		where: {
			id: key,
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
	key: string,
	data: Prisma.ApiKeyUpdateInput
) => {
	return await db.apiKey.update({
		where: {
			id: key,
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
