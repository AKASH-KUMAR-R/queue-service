import zod from "zod";

const UserLoginRequest = zod
	.object({
		identifier: zod.string().min(1).max(100),
		password: zod.string().min(6).max(100),
	})
	.strip();

export { UserLoginRequest };
