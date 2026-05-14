"use client";

import * as React from "react";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@shared/ui/pagination";

type PaginatedProps = {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export function Paginated({
	page,
	totalPages,
	onPageChange,
}: PaginatedProps): React.ReactElement | null {
	if (totalPages <= 1) return null;

	const renderPages = () => {
		const pages = [];
		const delta = 3; // how many pages to show around current

		for (let i = 1; i <= totalPages; i++) {
			// always show first, last, current and neighbors
			if (
				i === 1 ||
				i === totalPages ||
				(i >= page - delta && i <= page + delta)
			) {
				pages.push(
					<PaginationItem key={i}>
						<PaginationLink
							isActive={i === page}
							onClick={(e) => {
								e.preventDefault();
								onPageChange(i);
							}}
						>
							{i}
						</PaginationLink>
					</PaginationItem>,
				);
			} else if (i === page - (delta + 1) || i === page + (delta + 1)) {
				// show ellipsis around skipped ranges
				pages.push(
					<PaginationItem key={`ellipsis-${i}`}>
						<PaginationEllipsis />
					</PaginationItem>,
				);
			}
		}

		return pages;
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={(e) => {
							e.preventDefault();
							if (page > 1) onPageChange(page - 1);
						}}
					/>
				</PaginationItem>

				{renderPages()}

				<PaginationItem>
					<PaginationNext
						onClick={(e) => {
							e.preventDefault();
							if (page < totalPages) onPageChange(page + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
