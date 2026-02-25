import passport from "passport";
import {
	ExtractJwt,
	Strategy as JWTStrategy,
	type StrategyOptionsWithoutRequest,
} from "passport-jwt";

import userService from "@services/user/user.service";

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
const opts: StrategyOptionsWithoutRequest = {
	jwtFromRequest: jwtFromRequestCookie,
	secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
	new JWTStrategy(opts, async (payload, done) => {
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

export default passport;
