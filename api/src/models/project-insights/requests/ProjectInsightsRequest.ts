import zod from "zod";

const ProjectInsightsRequest = zod
	.object({
		from: zod.iso.datetime(),
		to: zod.iso.datetime(),
	})
	.strip();

export default ProjectInsightsRequest;

export type ProjectInsightsRequestType = zod.infer<
	typeof ProjectInsightsRequest
>;

