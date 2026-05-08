import zod from "zod";

const QueueInsightsRequest = zod
	.object({
		from: zod.iso.datetime(),
		to: zod.iso.datetime(),
	})
	.strip();

export default QueueInsightsRequest;

export type QueueInsightsRequestType = zod.infer<typeof QueueInsightsRequest>;
