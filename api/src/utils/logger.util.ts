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
					destination: 1,
				},
				level: "info",
			},
			...(process.env.NODE_ENV !== "production"
				? [
						{
							target: "pino/file",
							options: {
								destination: path.join(
									__dirname,
									"..",
									"..",
									"./logs/info.log",
								),
								mkdir: true,
							},
							level: "info",
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
								mkdir: true,
							},
							level: "error",
						},
					]
				: []),
		],
	}),
);
