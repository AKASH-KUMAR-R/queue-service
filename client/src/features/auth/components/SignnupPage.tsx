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
import { mapServerFieldErrorToFormFields } from "@/shared/utils/formUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";

import { useAuthSignup } from "../data/authSIgnupForm";

const signUpSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	name: z.string().min(1, "Name is required"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

const SignupPage = () => {
	const navigate = useNavigate();

	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			name: "",
			password: "",
		},
	});

	const [showPassword, setShowPassword] = useState(false);

	const handleFormError = (
		message: string | null,
		errors: Record<string, string> | null,
	) => {
		if (message) {
			toast.error(message);
		}
		if (errors) {
			mapServerFieldErrorToFormFields(form.setError, errors);
		}
	};

	const { mutate, isPending: isLoading } = useAuthSignup(handleFormError);

	const handleSignup = async () => {
		const values = form.getValues();

		mutate(
			{
				email: values.email,
				name: values.name,
				password: values.password,
			},
			{
				onSuccess: () => {
					toast.success("Signup successful! Please log in.");
					navigate("/");
				},
			},
		);
	};

	return (
		<div className="h-screen flex items-center justify-center bg-background p-4">
			<div className="w-full max-w-md">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-primary text-primary-foreground mb-4">
						{/* <Queue />  */}
					</div>
					<h1 className="text-2xl font-semibold mb-2">
						Welcome Newbie
					</h1>
					<p className="text-muted-foreground">
						Create your Queue Service account
					</p>
				</div>

				<div className="bg-card border border-border rounded-lg shadow-lg p-6">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSignup)}>
							<div className="space-y-4">
								<RadixFormField
									name="name"
									control={form.control}
									render={({ field }) => (
										<RadixFormItem>
											<RadixFormLabel>
												Name
											</RadixFormLabel>
											<RadixFormControl>
												<Input
													type="text"
													placeholder="Your name"
													{...field}
													value={field.value}
													onChange={field.onChange}
												/>
											</RadixFormControl>
											<RadixFormMessage />
										</RadixFormItem>
									)}
								/>
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
										"Sign Up"
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
						Already have an account?{" "}
						<Link
							to="/"
							className="text-primary font-medium hover:underline"
						>
							Login
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

export default SignupPage;
