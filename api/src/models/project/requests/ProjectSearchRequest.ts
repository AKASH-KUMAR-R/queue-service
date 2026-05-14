import zod from "zod";

const ProjectSearchRequest = zod
	.object({
		id: zod.string().optional(),
		title: zod.string().optional(),
		page: zod.coerce.number().min(1).optional(),
		limit: zod.coerce.number().min(1).max(100).optional(),
	})
	.strip();

export { ProjectSearchRequest };

export type ProjectSearchRequestType = zod.infer<typeof ProjectSearchRequest>;

export type ProjectFilters = {
	id?: string;
	title?: string;
};
