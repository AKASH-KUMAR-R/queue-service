import type { PrismaClient, Project, User } from "@db/client";

declare global {
	namespace Express {
		interface Request {
			validQuery?: any;
			db: PrismaClient;
			user?: Omit<User, "password">;
			project?: Project & {
				environment_id: string;
			};
			worker_id?: string;
			producer_id?: string;
		}
	}
}
