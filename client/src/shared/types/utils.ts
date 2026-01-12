export type PaginatedResult<T> = {
	results: T[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};
