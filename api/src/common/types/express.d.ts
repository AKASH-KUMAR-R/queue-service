import type { PrismaClient, Project, User } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			validQuery?: any;
			db: PrismaClient;
			user?: Omit<User, "password">;
			project?: Project;
			worker_id?: string;
			producer_id?: string;
		}
	}
}
