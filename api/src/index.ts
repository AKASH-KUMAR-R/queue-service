import { configDotenv } from "dotenv";
import Express from "express";
import cors from "cors";

import queueRouter from "./routes/queue/queue.routes";
import userRouter from "./routes/user/user.routes";
import projectRouter from "./routes/project/project.routes";
import { prismaMiddleware } from "./common/middleware/prisma.middleware";

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

app.use(Express.json());

app.use((req, res, next) => {
	console.log("Request Path:", req.path, "Method:", req.method);
	next();
});

app.use(prismaMiddleware);

app.use("/queue", queueRouter);
app.use("/user", userRouter);
app.use("/project", projectRouter);

app.listen(process.env.PORT, () => {
	console.log(
		"Server listening at port ",
		process.env.PORT,
		process.env.DATABASE_URL
	);
});
