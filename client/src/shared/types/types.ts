export type Base = {
	createdAt: string;
	updatedAt: string;
};

export type RawApiResponseBase = {
	created_at: string;
	updated_at: string;
};

// Paginated list type

export type PaginationParams = {
	page?: number;
	limit?: number;
};

export type PaginatedComponentProps = {
	totalPages: number;
	page: number;
	onPageChange: (page: number) => void;
};
