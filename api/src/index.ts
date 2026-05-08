import Express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";

import "@config/dotenv.config";
import passport from "@config/passport.config";

import cookieParser from "cookie-parser";
import cors from "cors";
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

import { startCronJobs } from "./scheduler/insights";

const app = Express();

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://mango-rock-02b08b800.2.azurestaticapps.net",
		],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
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
app.use(passport.initialize());
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
app.use("/api/dashboard/worker-status", workerStatusRouter);

//  routes for worker sdk
app.use("/api/worker/job", jobWorkerRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
	handleError(res, err);
});

app.listen(process.env.PORT, () => {
	console.log("Server listening at port ", process.env.PORT);
	startCronJobs();
});
