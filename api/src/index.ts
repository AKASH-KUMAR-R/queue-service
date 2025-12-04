import { configDotenv } from "dotenv";
import Express from "express";
import cors from "cors";

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

app.listen(process.env.PORT, () => {
	console.log(
		"Server listening at port ",
		process.env.PORT,
		process.env.DATABASE_URL
	);
});
