import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/shared/ui/button";
import { Form } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import {
	RadixFormControl,
	RadixFormField,
	RadixFormItem,
	RadixFormLabel,
	RadixFormMessage,
} from "@/shared/ui/radix-form";
import { Spinner } from "@/shared/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { useAuth } from "../context/AuthContext";
import {
	type AuthLoginFormErrorHandler,
	useAuthLoginForm,
} from "../data/authLoginForm";

const loginSchema = z.object({
	email: z.email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginPage = () => {
	const navigate = useNavigate();

	const { initialize } = useAuth();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [showPassword, setShowPassword] = useState(false);

	const handleFormError: AuthLoginFormErrorHandler = (message, errors) => {
		const values = form.getValues();

		if (errors) {
			Object.entries(errors).forEach(([field, message]) => {
				form.setError(field as keyof typeof values, {
					type: "server",
					message,
				});
			});
		}

		if (message) {
			toast.error(message);
		}
	};

	const { mutate, isPending: isLoading } = useAuthLoginForm(handleFormError);

	const handleLogin = async () => {
		const values = form.getValues();

		mutate(
			{
				identifier: values.email,
				password: values.password,
			},
			{
				onSuccess: (data) => {
					initialize(data.data.user);
					toast.success("Logged in successfully!");
					navigate("/queues");
				},
			},
		);
	};

	return (
		<div className=" h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground mb-4">
						{/* <Queue />  */}
					</div>
					<h1 className="text-2xl font-semibold mb-2">
						Welcome Back
					</h1>
					<p className="text-muted-foreground">
						Sign in to your Queue Service account
					</p>
				</div>

				<div className="bg-card border border-border rounded-lg shadow-lg p-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleLogin)}>
							<div className="space-y-4">
								<RadixFormField
									name="email"
									control={form.control}
									render={({ field }) => (
										<RadixFormItem>
											<RadixFormLabel>
												Email
											</RadixFormLabel>
											<RadixFormControl>
												<Input
													type="email"
													placeholder="you@example.com"
													{...field}
													value={field.value}
													onChange={field.onChange}
													// onBlur={() =>
													// 	handleFieldBlur("email")
													// }
													// onKeyPress={handleKeyPress}
												/>
											</RadixFormControl>
											<RadixFormMessage />
										</RadixFormItem>
									)}
								/>

								<RadixFormField
									name="password"
									control={form.control}
									render={({ field }) => (
										<RadixFormItem>
											<RadixFormLabel>
												Password
											</RadixFormLabel>
											<RadixFormControl>
												<div className="relative">
													<Input
														type={
															showPassword
																? "text"
																: "password"
														}
														placeholder="Enter your password"
														{...field}
														value={field.value}
														onChange={
															field.onChange
														}
														className="pr-10"
													/>
													<Button
														type="button"
														onClick={() =>
															setShowPassword(
																!showPassword,
															)
														}
														className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
														aria-label={
															showPassword
																? "Hide password"
																: "Show password"
														}
													></Button>
												</div>
											</RadixFormControl>
											<RadixFormMessage />
										</RadixFormItem>
									)}
								/>

								{/* Remember & Forgot */}
								{/* <div className="flex items-center justify-between">
								<label className="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={rememberMe}
										onChange={(e) =>
											setRememberMe(e.target.checked)
										}
										className="w-4 h-4 rounded border-input accent-primary"
									/>
									<span className="text-sm text-muted-foreground">
										Remember me
									</span>
								</label>
								<a
									href="#"
									className="text-sm text-primary hover:underline"
								>
									Forgot password?
								</a>
							</div> */}

								{/* Submit Button */}
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? (
										<Spinner size="sm" />
									) : (
										"Sign In"
									)}
								</Button>
							</div>
						</form>
					</Form>
					{/* Divider */}
					<div className="relative my-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-border"></div>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-card px-2 text-muted-foreground">
								Or continue with
							</span>
						</div>
					</div>

					{/* Social Login */}
					<div className="grid grid-cols-2 gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => alert("Google login")}
						>
							Google
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => alert("GitHub login")}
						>
							GitHub
						</Button>
					</div>

					{/* Sign Up Link */}
					<p className="text-center text-sm text-muted-foreground mt-6">
						Don't have an account?{" "}
						<Link
							to="/sign-up"
							className="text-primary font-medium hover:underline"
						>
							Sign up
						</Link>
					</p>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-muted-foreground mt-6">
					By signing in, you agree to our{" "}
					<a href="#" className="underline hover:text-foreground">
						Terms
					</a>{" "}
					and{" "}
					<a href="#" className="underline hover:text-foreground">
						Privacy Policy
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
