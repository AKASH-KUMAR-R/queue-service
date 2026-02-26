import api, { unauthorizedApi } from "@shared/api";

import type { User } from "@entities/user/types/user";

type LoginRequestPayload = {
	identifier: string;
	password: string;
};

type LoginResponse = {
	data: {
		user: User;
		success: boolean;
		message: string;
	};
	error: string | null;
};
type SignupResponse = {
	data: {
		user: User;
		success: boolean;
		message: string;
	};
	error: string | null;
};

type SignupRequestPayload = {
	name: string;
	email: string;
	password: string;
};

type LogoutResponse = {
	data: {
		success: boolean;
		message: string;
	};
};

const login = async (data: LoginRequestPayload): Promise<LoginResponse> => {
	const response = await unauthorizedApi.post("/api/auth/login", data);
	return { data: response.data, error: null };
};

const signup = async (data: SignupRequestPayload): Promise<SignupResponse> => {
	const response = await unauthorizedApi.post("/api/auth/signup", data);

	return { data: response.data, error: null };
};

const logout = async (): Promise<LogoutResponse> => {
	const response = await api.post("/api/auth/logout");

	return { data: response.data };
};

export default {
	login,
	signup,
	logout,
};
