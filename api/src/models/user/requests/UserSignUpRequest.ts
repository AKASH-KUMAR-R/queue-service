import zod from "zod";

const UserSignUpRequest = zod
	.object({
		name: zod.string().min(1).max(100).optional(),
		email: zod.email(),
		password: zod.string().min(8),
	})
	.strip();

export { UserSignUpRequest };
