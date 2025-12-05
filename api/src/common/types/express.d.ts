import type { PrismaClient, Project, User } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			db: PrismaClient;
			user?: User;
			project?: Project;
		}
	}
}
