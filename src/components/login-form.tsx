// src/components/login-form.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import {
	Mail,
	Lock,
	LogIn,
	Sparkles,
	AlertCircle,
	Eye,
	EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

// Schema de validación mejorado
const loginSchema = z.object({
	email: z
		.string()
		.min(1, "El correo electrónico es requerido")
		.email("Por favor ingresa un correo electrónico válido")
		.toLowerCase()
		.trim(),
	password: z
		.string()
		.min(1, "La contraseña es requerida")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const {
		login,
		loading: authLoading,
		error: authError,
		clearError,
	} = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [loginAttempts, setLoginAttempts] = useState(0);
	const [isBlocked, setIsBlocked] = useState(false);
	const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// Manejar parámetros de URL (ej: session=expired)
	useEffect(() => {
		const session = searchParams.get("session");
		const from = searchParams.get("from");

		if (session === "expired") {
			toast.error(
				"Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
			);
		}

		if (from) {
			toast.info("Debes iniciar sesión para acceder a esa página");
		}
	}, [searchParams]);

	// Manejar bloqueo por intentos fallidos
	useEffect(() => {
		if (loginAttempts >= 5) {
			setIsBlocked(true);
			const blockDuration = 5 * 60 * 1000; // 5 minutos
			const unblockTime = Date.now() + blockDuration;

			const timer = setInterval(() => {
				const remaining = Math.max(0, unblockTime - Date.now());
				setBlockTimeRemaining(Math.ceil(remaining / 1000));

				if (remaining === 0) {
					setIsBlocked(false);
					setLoginAttempts(0);
					clearInterval(timer);
				}
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [loginAttempts]);

	// Limpiar errores cuando el usuario empiece a escribir
	useEffect(() => {
		const subscription = form.watch(() => {
			if (authError) {
				clearError();
			}
		});
		return () => subscription.unsubscribe();
	}, [form, authError, clearError]);

	const onSubmit = async (values: LoginFormValues) => {
		if (isBlocked) {
			toast.error(
				`Demasiados intentos fallidos. Espera ${blockTimeRemaining} segundos.`,
			);
			return;
		}

		setIsLoading(true);

		try {
			const success = await login({
				email: values.email,
				password: values.password,
			});

			if (success) {
				// El AuthContext maneja la redirección
				form.reset();
				setLoginAttempts(0);
			} else {
				// Incrementar intentos fallidos
				setLoginAttempts((prev) => prev + 1);

				if (loginAttempts + 1 >= 3) {
					toast.warning(`Tienes ${5 - (loginAttempts + 1)} intentos restantes`);
				}
			}
		} catch (error) {
			console.error("Error durante el login:", error);
			toast.error("Error inesperado. Por favor, intenta nuevamente.");
		} finally {
			setIsLoading(false);
		}
	};

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card className="overflow-hidden p-0 shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md max-w-5xl mx-auto">
				<CardContent className="grid p-0 md:grid-cols-2">
					{/* Formulario lado izquierdo */}
					<div className="p-8 md:p-12 flex flex-col justify-center">
						<div className="mb-8 text-center">
							<div className="flex items-center justify-center mb-6">
								<div className="relative">
									<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-3">
										<LogIn className="w-8 h-8 text-white" />
									</div>
									<div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
										<Sparkles className="w-3 h-3 text-yellow-800" />
									</div>
								</div>
							</div>
							<CardTitle className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								¡Bienvenid@!
							</CardTitle>
							<p className="text-gray-600 dark:text-gray-400 text-lg">
								Ingresa con tus credenciales para acceder
							</p>
						</div>

						{/* Mostrar error global si existe */}
						{authError && (
							<div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
								<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
								<div className="flex-1">
									<p className="text-sm text-red-800 dark:text-red-200 font-medium">
										{authError}
									</p>
								</div>
							</div>
						)}

						{/* Mostrar bloqueo por intentos */}
						{isBlocked && (
							<div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
								<p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
									Cuenta bloqueada temporalmente. Intenta nuevamente en{" "}
									{formatTime(blockTimeRemaining)}
								</p>
							</div>
						)}

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
												<Mail className="w-4 h-4 text-blue-600" />
												Correo Electrónico
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													type="email"
													placeholder="tu@correo.com"
													autoComplete="email"
													className="h-12 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400"
													disabled={isLoading || isBlocked}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-base font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
												<Lock className="w-4 h-4 text-purple-600" />
												Contraseña
											</FormLabel>
											<FormControl>
												<div className="relative">
													<Input
														{...field}
														type={showPassword ? "text" : "password"}
														placeholder="••••••••"
														autoComplete="current-password"
														className="h-12 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg placeholder:text-gray-500 dark:placeholder:text-gray-400 pr-12"
														disabled={isLoading || isBlocked}
													/>
													<button
														type="button"
														onClick={() => setShowPassword(!showPassword)}
														className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
														tabIndex={-1}
													>
														{showPassword ? (
															<EyeOff className="w-5 h-5" />
														) : (
															<Eye className="w-5 h-5" />
														)}
													</button>
												</div>
											</FormControl>
											<FormDescription className="text-gray-500 dark:text-gray-400">
												Mínimo 6 caracteres
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex items-center justify-between">
									<Link
										href="/forgot-password"
										className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
									>
										¿Olvidaste tu contraseña?
									</Link>
								</div>

								<Button
									type="submit"
									className="w-full h-14 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
									disabled={isLoading || authLoading || isBlocked}
								>
									{isLoading || authLoading ? (
										<div className="flex items-center gap-2">
											<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
											Ingresando...
										</div>
									) : (
										<div className="flex items-center gap-2">
											<LogIn className="w-5 h-5" />
											Iniciar Sesión
										</div>
									)}
								</Button>

								<div className="text-center">
									<p className="text-sm text-gray-600 dark:text-gray-400">
										¿No tienes una cuenta?{" "}
										<Link
											href="/register"
											className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
										>
											Regístrate aquí
										</Link>
									</p>
								</div>
							</form>
						</Form>
					</div>

					{/* Imagen lado derecho */}
					<div className="relative hidden md:block bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
						<Image
							src="/loginimage.webp"
							alt="Acceso a la plataforma"
							width={600}
							height={600}
							className="absolute inset-0 h-full w-full object-cover rounded-r-2xl"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-r-2xl" />

						{/* Overlay con información */}
						<div className="absolute inset-0 flex items-center justify-center p-12">
							<div className="text-center text-white">
								<h2 className="text-3xl font-bold mb-4 drop-shadow-lg">
									Sistema de Gestión de Citas
								</h2>
								<p className="text-lg drop-shadow-md">
									Administra tus citas de manera eficiente y profesional
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
