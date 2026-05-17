import { Edit } from "lucide-react";

import type { PaginatedComponentProps } from "@shared/types/types";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Paginated } from "@shared/ui/pagination/Paginated";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@shared/ui/table";
import { formatDateTime } from "@shared/utils/dateAndTimeUtils";

import type { Environment } from "@entities/environment/types/types";

type EnvironmentTableProps = PaginatedComponentProps & {
	data: Environment[];
	onEdit: (environment: Environment) => void;
};

export const EnvironmentTable = ({
	data,
	page,
	totalPages,
	onPageChange,
	onEdit,
}: EnvironmentTableProps) => {
	return (
		<div className="w-full space-y-2">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Default</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((environment) => (
						<TableRow key={environment.id}>
							<TableCell className="font-medium">
								{environment.name}
							</TableCell>
							<TableCell>
								{environment.isDefault ? (
									<Badge>Default</Badge>
								) : (
									<Badge variant="outline">Custom</Badge>
								)}
							</TableCell>
							<TableCell>
								<Badge
									variant={
										environment.isActive
											? "secondary"
											: "destructive"
									}
								>
									{environment.isActive
										? "Active"
										: "Inactive"}
								</Badge>
							</TableCell>
							<TableCell>
								{formatDateTime(environment.createdAt)}
							</TableCell>
							<TableCell>
								{formatDateTime(environment.updatedAt)}
							</TableCell>
							<TableCell>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => onEdit(environment)}
								>
									<Edit className="mr-2 size-4" />
									Edit
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Paginated
				page={page}
				totalPages={totalPages}
				onPageChange={onPageChange}
			/>
		</div>
	);
};
