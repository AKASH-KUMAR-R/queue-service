import type { Prisma, PrismaClient } from "@prisma/client";
import type { ModelName } from "../types/model";

const create = async <M extends ModelName>(
	model: M,
	db: PrismaClient,
	data: Prisma.Args<PrismaClient[M], "create">["data"]
) => {
	return await (db[model] as any).create({ data });
};

const updateById = async <M extends ModelName>(
	model: M,
	db: PrismaClient,
	id: number,
	data: Prisma.Args<PrismaClient[M], "update">["data"]
) => {
	return await (db[model] as any).update({
		where: { id },
		data,
	});
};

const deleteById = async <M extends ModelName>(
	model: M,
	db: PrismaClient,
	id: number
) => {
	return await (db[model] as any).delete({
		where: { id },
	});
};

const findById = async <M extends ModelName>(
	model: M,
	db: PrismaClient,
	id: number
) => {
	return await (db[model] as any).findUnique({
		where: { id },
	});
};

const findAll = async <M extends ModelName>(model: M, db: PrismaClient) => {
	return await (db[model] as any).findMany();
};

const findMany = async <M extends ModelName>(
	model: M,
	db: PrismaClient,
	page: number,
	limit: number,
	query = {}
) => {
	const filters = { ...query, skip: (page - 1) * limit, take: limit };

	const result = await (db[model] as any).findMany(filters);
	const total = await (db[model] as any).count({ where: query });

	const paginationResult = {
		page,
		limit,
		totalPages: Math.ceil(total / limit),
		result,
	};

	return paginationResult;
};

export default {
	create,
	updateById,
	deleteById,
	findById,
	findAll,
	findMany,
};
