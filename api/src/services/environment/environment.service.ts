import type { Prisma, PrismaClient } from "@db/client";

import type { EnvironmentFilters } from "@models/environment/requests/EnvironmentSearchRequest";
import type { EnvironmentUpdateData } from "@models/environment/requests/EnvironmentUpdateRequest";

import { PaginationParams, PaginationResults } from "@utils/pagination.util";

const createEnvironment = async (
	db: PrismaClient,
	data: Prisma.EnvironmentUncheckedCreateInput,
) => {
	return await db.$transaction(async (tx) => {
		if (data.is_default) {
			await tx.environment.updateMany({
				where: {
					project_id: data.project_id,
					is_default: true,
				},
				data: {
					is_default: false,
				},
			});
		}

		return await tx.environment.create({
			data: {
				name: data.name,
				is_default: data.is_default ?? false,
				project: {
					connect: { id: data.project_id },
				},
			},
		});
	});
};

const findById = async (db: PrismaClient, id: string) => {
	return await db.environment.findUnique({
		where: { id },
	});
};

const findEnvironments = async (
	db: PrismaClient,
	query: EnvironmentFilters,
	page: number,
	limit: number,
) => {
	const paginationParams = new PaginationParams(page, limit);
	const trimmedName = query.name?.trim();

	const whereQuery: Prisma.EnvironmentWhereInput = {
		...(query.project_id && { project_id: query.project_id }),
		...(trimmedName && {
			name: { contains: trimmedName, mode: "insensitive" },
		}),
		...(query.is_default !== undefined && { is_default: query.is_default }),
		is_active: true,
	};

	const results = await db.environment.findMany({
		where: whereQuery,
		orderBy: {
			created_at: "desc",
		},
		skip: paginationParams.offset,
		take: paginationParams.limit,
	});

	const total = await db.environment.count({
		where: whereQuery,
	});

	return new PaginationResults(results, page, limit, total);
};

const updateById = async (
	db: PrismaClient,
	id: string,
	data: EnvironmentUpdateData,
) => {
	return await db.$transaction(async (tx) => {
		const existingEnvironment = await tx.environment.findUnique({
			where: { id, is_active: true },
		});

		if (!existingEnvironment) {
			throw new Error("Environment not found");
		}

		if (data.is_default) {
			await tx.environment.updateMany({
				where: {
					project_id: existingEnvironment.project_id,
					is_default: true,
					NOT: { id: existingEnvironment.id },
				},
				data: {
					is_default: false,
				},
			});
		}

		return await tx.environment.update({
			where: { id },
			data,
		});
	});
};

const setDefaultById = async (db: PrismaClient, id: string) => {
	return await db.$transaction(async (tx) => {
		const existingEnvironment = await tx.environment.findUnique({
			where: { id, is_active: true },
		});

		if (!existingEnvironment) {
			throw new Error("Environment not found");
		}

		await tx.environment.updateMany({
			where: {
				project_id: existingEnvironment.project_id,
				is_default: true,
				NOT: { id: existingEnvironment.id },
			},
			data: {
				is_default: false,
			},
		});

		return await tx.environment.update({
			where: { id },
			data: {
				is_default: true,
			},
		});
	});
};

const deleteById = async (db: PrismaClient, id: string) => {
	return await db.environment.update({
		where: { id },
		data: {
			is_active: false,
		},
	});
};

export default {
	createEnvironment,
	findById,
	findEnvironments,
	updateById,
	setDefaultById,
	deleteById,
};
