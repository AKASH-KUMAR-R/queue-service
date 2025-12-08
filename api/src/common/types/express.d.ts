import type { PrismaClient, Project, User } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			validQuery?: any;
			db: PrismaClient;
			user?: User;
			project?: Project;
		}
	}
}
