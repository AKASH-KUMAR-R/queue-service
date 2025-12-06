import { configDotenv } from "dotenv";
import Express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import cors from "cors";
import pinoHttp from "pino-http";

import { logger } from "@utils/logger.util";

import queueRouter from "@routes/queue/queue.routes";
import userRouter from "@routes/user/user.routes";
import projectRouter from "@routes/project/project.routes";
import { prismaMiddleware } from "@common/middleware/prisma.middleware";
import { handleError } from "@utils/error.util";

const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = NODE_ENV === "production" ? ".prod.env" : ".dev.env";

configDotenv({
	path: envPath,
});

const app = Express();

app.use(
	cors({
		origin: "*",
	})
);

app.use(
	pinoHttp({
		logger,
		autoLogging: true,
	})
);

app.use(Express.json());

app.use((req, res, next) => {
	console.log("Request Path:", req.path, "Method:", req.method);
	next();
});

app.use(prismaMiddleware);

app.use("/queue", queueRouter);
app.use("/user", userRouter);
app.use("/project", projectRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err.message);
	handleError(res, err);
});

app.listen(process.env.PORT, () => {
	console.log(
		"Server listening at port ",
		process.env.PORT,
		process.env.DATABASE_URL
	);
});
