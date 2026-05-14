import type { Prisma, PrismaClient } from "@db/client";

import type { ProjectFilters } from "@models/project/requests/ProjectSearchRequest";

import { PaginationParams, PaginationResults } from "@utils/pagination.util";

const create = async (
	db: PrismaClient,
	data: Prisma.ProjectUncheckedCreateInput,
) => {
	const enrichedData: Prisma.ProjectCreateInput = {
		label: data.label,
		description: data.description || null,
		user: {
			connect: {
				id: data.user_id,
			},
		},
	};
	return await db.project.create({
		data: enrichedData,
	});
};

const getProjectById = async (db: PrismaClient, id: string) => {
	return await db.project.findUnique({
		where: { id },
	});
};

const findProjects = async (
	db: PrismaClient,
	query: ProjectFilters,
	page: number,
	limit: number,
) => {
	const paginationParams = new PaginationParams(page, limit);
	const trimmedId = query.id?.trim();
	const trimmedTitle = query.title?.trim();

	const or_conditions: Prisma.ProjectWhereInput[] = [
		...(trimmedId
			? [
					{
						id: {
							contains: trimmedId,
							mode: "insensitive" as const,
						},
					},
				]
			: []),
		...(trimmedTitle
			? [
					{
						label: {
							contains: trimmedTitle,
							mode: "insensitive" as const,
						},
					},
				]
			: []),
	];

	const whereQuery: Prisma.ProjectWhereInput = {
		...(or_conditions.length > 0 ? { OR: or_conditions } : {}),
	};

	const results = await db.project.findMany({
		where: whereQuery,
		orderBy: {
			created_at: "desc",
		},
		take: paginationParams.limit,
		skip: paginationParams.offset,
	});

	const count = await db.project.count({
		where: whereQuery,
	});

	return new PaginationResults(results, page, limit, count);
};

export default {
	create,
	getProjectById,
	findProjects,
};
