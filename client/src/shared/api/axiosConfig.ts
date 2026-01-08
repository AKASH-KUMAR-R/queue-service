import axios from "axios";

export const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export const api = axios.create({
	// use this for all api calls expect auth call such as login and signup.
	baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
	withCredentials: true,
	// add any other headers
});

export const unauthorizedApi = axios.create({
	// use for only login and signup
	baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
	withCredentials: true,
	// add any other headers
});
