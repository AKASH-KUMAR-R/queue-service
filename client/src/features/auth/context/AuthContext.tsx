import { createContext, useContext, useState } from "react";

import type { User } from "@/entities/user/types/user";

type AuthContextType = {
	user: User | null;
	initialize: (data: User) => void;
	update: (data: Partial<User>) => void;
	clear: () => void;
} | null;

const AuthContext = createContext<AuthContextType | undefined>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	const initialize = (data: User) => {
		setUser(data);
	};

	const update = (data: Partial<User>) => {
		setUser((prevUser) => (prevUser ? { ...prevUser, ...data } : prevUser));
	};

	const clear = () => {
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				initialize,
				update,
				clear,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined || context === null) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

export default AuthProvider;
