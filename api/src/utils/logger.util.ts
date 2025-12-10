import path from "path";
import pino from "pino";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const logger = pino(
	{
		level: "info",
		redact: ["password", "token", "authorization", "x-api-key"], // later add other fields
	},
	pino.transport({
		targets: [
			{
				target: "pino/file",
				options: {
					destination: path.join(
						__dirname,
						"..",
						"..",
						"./logs/all.log",
					),
				},
			},
			{
				target: "pino/file",
				options: {
					destination: path.join(
						__dirname,
						"..",
						"..",
						"./logs/error.log",
					),
				},
				level: "error",
			},
			{
				target: "pino/file",
				options: {
					destination: 1,
				},
				level: "info",
			},
		],
	}),
);
