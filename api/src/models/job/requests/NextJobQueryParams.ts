import zod from "zod";

const NextJobQueryParams = zod.object({
	queue_label: zod.string(),
});

export default NextJobQueryParams;
