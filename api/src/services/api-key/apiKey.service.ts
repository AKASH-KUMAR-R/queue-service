import type { ApiKey, Prisma, PrismaClient } from "@db/client";

import type { ApiKeySearchRequest } from "@models/api-key/requests/ApiKeySearchRequest";

import { PaginationParams, PaginationResults } from "@utils/pagination.util";

type ApiKeySearchFilters = Omit<ApiKeySearchRequest, "page" | "limit">;
type ApiKeyPublic = Omit<ApiKey, "secret">;

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

const search = async (
	db: PrismaClient,
	filters: ApiKeySearchFilters,
	page: number,
	limit: number,
) => {
	const paginationParams = new PaginationParams(page, limit);

	const whereQuery: Prisma.ApiKeyWhereInput = {
		...(filters.project_id && { project_id: filters.project_id }),
		...(filters.environment_id && {
			environment_id: filters.environment_id,
		}),
		...(filters.revoked !== undefined && { revoked: filters.revoked }),
	};

	const results = await db.apiKey.findMany({
		where: whereQuery,
		skip: paginationParams.offset,
		take: paginationParams.limit,
	});
	const total = await db.apiKey.count({ where: whereQuery });

	const sanitizedResults: ApiKeyPublic[] = results.map(
		({ secret: _secret, ...rest }) => rest,
	);

	return new PaginationResults(
		sanitizedResults,
		paginationParams.page,
		paginationParams.limit,
		total,
	);
};

export default {
	createApiKey,
	findApiKeyById,
	findApiKeyBySecret,
	updateApiKeyById,
	search,
};
