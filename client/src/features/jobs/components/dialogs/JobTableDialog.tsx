import { JobsTable } from "@widgets/JobsTable";

import { LoadingState } from "@shared/ui/LoadingState";
import { Dialog, DialogContent, DialogTitle } from "@shared/ui/dialog";

import type { Job } from "@entities/job/types/types";

type JobTableDialogProps = {
	data: Job[];
	isOpen: boolean;
	onClose: () => void;
	onViewJob: (jobId: string) => void;
	isLoading?: boolean;
};

const JobTableDialog: React.FC<JobTableDialogProps> = ({
	data,
	isOpen,
	onClose,
	onViewJob,
	isLoading = false,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className=" w-full sm:max-w-7xl h-[calc(100%-4rem)]">
				<DialogTitle> Worker Jobs LIst</DialogTitle>

				{isLoading ? (
					<LoadingState />
				) : (
					<JobsTable
						jobs={data}
						onViewClick={onViewJob}
						totalPages={1}
						onPageChange={(_page) => {}}
						page={1}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default JobTableDialog;
