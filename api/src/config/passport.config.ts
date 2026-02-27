import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";
import {
	ExtractJwt,
	Strategy as JWTStrategy,
	type StrategyOptionsWithoutRequest,
} from "passport-jwt";

import apiKeyService from "@services/api-key/apiKey.service";
import userService from "@services/user/user.service";

import { hashToken } from "@utils/crypto.util";
import { prisma } from "@utils/prisma.util";

const jwtFromRequestCookie = ExtractJwt.fromExtractors([
	(req) => {
		let token = null;
		if (req && req.cookies) {
			token = req.cookies.accessToken;
		}
		return token;
	},
]);
const jwtOpts: StrategyOptionsWithoutRequest = {
	jwtFromRequest: jwtFromRequestCookie,
	secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
	new JWTStrategy(jwtOpts, async (payload, done) => {
		try {
			const user = await userService.findUserById(prisma, payload.userId);

			if (!user) {
				return done(null, false);
			}

			return done(null, user);
		} catch (err) {
			done(err, false);
		}
	}),
);

passport.use(
	"api-key",
	new CustomStrategy(async (req, done) => {
		try {
			const apiKey = req.headers["x-api-key"] as string;

			if (!apiKey) {
				return done(null, false);
			}

			const hashedApiKey = hashToken(apiKey);

			const result = await apiKeyService.findApiKeyBySecret(
				prisma,
				hashedApiKey,
			);

			if (!result || result.revoked) {
				return done(null, false);
			}

			return done(null, result.project);
		} catch (err) {
			done(err, false);
		}
	}),
);

export default passport;
