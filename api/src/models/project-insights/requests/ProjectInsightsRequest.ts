import { DAY_IN_MILLISECONDS } from "lib/time";
import zod from "zod";

const ProjectInsightsRequest = zod
	.object({
		from: zod.iso.datetime(),
		to: zod.iso.datetime(),
	})
	.strip()
	.superRefine(({ from, to }, ctx) => {
		const fromDate = new Date(from);
		const toDate = new Date(to);

		if (fromDate > toDate) {
			ctx.addIssue({
				code: "custom",
				type: "date",
				path: ["from"],
				message: "The 'from' date must be before the 'to' date",
			});
		}

		if (
			Math.abs(fromDate.getTime() - toDate.getTime()) /
				DAY_IN_MILLISECONDS >
			7
		) {
			ctx.addIssue({
				code: "custom",
				max: 7,
				type: "date",
				path: ["to"],
				message: "The maximum allowed range is 7 days",
			});
		}
	});

export default ProjectInsightsRequest;

export type ProjectInsightsRequestType = zod.infer<
	typeof ProjectInsightsRequest
>;
