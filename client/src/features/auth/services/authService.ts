import type { User } from "@/entities/user/types/user";
import api from "@/shared/api";

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

const login = async (data: LoginRequestPayload): Promise<LoginResponse> => {
	const response = await api.post("/api/auth/login", data);
	return { data: response.data, error: null };
};

const signup = async (data: SignupRequestPayload): Promise<SignupResponse> => {
	const response = await api.post("/api/auth/signup", data);

	return { data: response.data, error: null };
};

export default {
	login,
	signup,
};
