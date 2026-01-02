export class PaginationParams {
	limit: number;
	offset: number;
	page: number;

	constructor(page: number = 1, limit: number = 10) {
		this.page = Math.max(1, page);
		this.limit = Math.max(1, limit);

		this.offset = (this.page - 1) * this.limit;
	}
}

export class PaginationResults<T> {
	results: T[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;

	constructor(data: T[], page: number, limit: number, total: number) {
		this.results = data;
		this.page = page;
		this.limit = limit;
		this.total = total;
		this.totalPages = Math.ceil(this.total / this.limit);
	}
}
