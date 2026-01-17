import zod from "zod";

const NextJobQueryParams = zod
	.object({
		queue_label: zod.string(),
	})
	.strip();

export default NextJobQueryParams;

export type NextJobQueryParamsType = zod.infer<typeof NextJobQueryParams>;
