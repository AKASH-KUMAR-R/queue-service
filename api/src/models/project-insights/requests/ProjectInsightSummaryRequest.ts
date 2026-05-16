import zod from "zod";

const ProjectInsightSummaryRequest = zod
	.object({
		environment_id: zod.string(),
	})
	.strip();

export default ProjectInsightSummaryRequest;

export type ProjectInsightSummaryRequestType = zod.infer<
	typeof ProjectInsightSummaryRequest
>;
