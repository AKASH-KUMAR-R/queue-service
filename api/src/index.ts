import Express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import { configDotenv } from "dotenv";
import pinoHttp from "pino-http";

import { prismaMiddleware } from "@common/middleware/prisma.middleware";

import apiKeyRouter from "@routes/api-key/apiKey.routes";
import authRouter from "@routes/auth/auth.routes";
import jobEventsRouter from "@routes/job-events/jobEvents.routes";
import jobDashboardRouter from "@routes/job/job.dashboard.routes";
import jobWorkerRouter from "@routes/job/job.worker.routes";
import projectRouter from "@routes/project/project.routes";
import queueMetricsRouter from "@routes/queue-metrics/queueMetrics.routes";
import queueRouter from "@routes/queue/queue.routes";
import userRouter from "@routes/user/user.routes";
import workerStatusRouter from "@routes/worker-status/workerStatus.routes";

import { handleError } from "@utils/error.util";
import { logger } from "@utils/logger.util";

const NODE_ENV = process.env.NODE_ENV || "development";
const envPath = NODE_ENV === "production" ? ".prod.env" : ".dev.env";

configDotenv({
	path: envPath,
});

const app = Express();

app.use(
	cors({
		origin: "*",
	}),
);

app.use(
	pinoHttp({
		logger,
		autoLogging: true,
	}),
);

app.use(Express.json());

app.use(cookieParser());

app.use(prismaMiddleware);

// Routes for auth
app.use("/api/auth", authRouter);

// Routes for dashboards and other common UI cases
app.use("/api/dashboard/queue", queueRouter);
app.use("/api/dashboard/user", userRouter);
app.use("/api/dashboard/project", projectRouter);
app.use("/api/dashboard/api-key", apiKeyRouter);
app.use("/api/dashboard/job-events", jobEventsRouter);
app.use("/api/dashboard/queue-metrics", queueMetricsRouter);
app.use("/api/dashboard/job", jobDashboardRouter);

//  routes for worker sdk
app.use("/api/worker/job", jobWorkerRouter);
app.use("/api/worker/worker-status", workerStatusRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	console.error(err.message);
	handleError(res, err);
});

app.listen(process.env.PORT, () => {
	console.log("Server listening at port ", process.env.PORT);
});
