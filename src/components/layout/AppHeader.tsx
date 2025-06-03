// src/components/layout/AppHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
	Home,
	Calendar,
	Plus,
	ArrowLeft,
	Menu,
	HeartHandshakeIcon,
	LogInIcon,
	BarChart3, // 🆕 Icono para Dashboard
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AppHeaderProps {
	showBackButton?: boolean;
	title?: string;
	subtitle?: string;
}

export default function AppHeader({
	showBackButton = false,
	title,
}: AppHeaderProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const { isAuthenticated, user, logout } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const isHomePage = pathname === "/";
	const isCalendarPage = pathname === "/admin/citas";
	const isNewAppointmentPage = pathname === "/admin/citas/nueva";
	const isDashboardPage = pathname === "/dashboard"; // 🆕

	// 🆕 Determinar si el usuario puede ver el dashboard
	const canViewDashboard =
		isAuthenticated && (user?.role === "admin" || user?.role === "psicologo");

	const navigationItems = [
		{
			href: "/",
			label: "Inicio",
			icon: Home,
			active: isHomePage,
			showWhen: "always" as const,
		},
		// 🆕 Agregar Dashboard como segunda opción
		{
			href: "/dashboard",
			label: "Dashboard",
			icon: BarChart3,
			active: isDashboardPage,
			showWhen: "authenticated" as const,
		},
		{
			href: "/admin/citas",
			label: "Calendario",
			icon: Calendar,
			active: isCalendarPage,
			showWhen: "authenticated" as const,
		},
		{
			href: "/admin/citas/nueva",
			label: "Nueva Cita",
			icon: Plus,
			active: isNewAppointmentPage,
			showWhen: "authenticated" as const,
		},
	];

	// 🆕 Filtrar items según autenticación
	const visibleItems = navigationItems.filter((item) => {
		if (item.showWhen === "always") return true;
		if (item.showWhen === "authenticated")
			return isAuthenticated && canViewDashboard;
		return false;
	});

	return (
		<header
			className={cn(
				"sticky top-0 z-[100] w-full border-b transition-all duration-300",
				isScrolled
					? "border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg"
					: "border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm shadow-sm",
			)}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 sm:h-20">
					{/* Logo y navegación principal */}
					<div className="flex items-center gap-4 sm:gap-6">
						{showBackButton ? (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => router.back()}
								className="p-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
							>
								<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
							</Button>
						) : (
							<Link href="/" className="flex items-center gap-2 sm:gap-3">
								<div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
									<HeartHandshakeIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
								</div>
								<div className="hidden sm:block">
									<h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
										Horizonte
									</h1>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										Sistema de Citas
									</p>
								</div>
							</Link>
						)}

						{/* Título de página en mobile */}
						{(title || showBackButton) && (
							<div className="sm:hidden">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
									{title}
								</h2>
							</div>
						)}
					</div>

					{/* Navegación desktop - 🆕 Usar items filtrados */}
					{isAuthenticated && (
						<nav className="hidden md:flex items-center gap-2">
							{visibleItems.slice(1).map((item) => {
								const Icon = item.icon;
								return (
									<Link key={item.href} href={item.href}>
										<Button
											variant={"ghost"}
											size="sm"
											className={cn(
												"flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
												item.active
													? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
													: "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-700/50",
											)}
										>
											<Icon className="w-fit h-4" />
											{item.label}
										</Button>
									</Link>
								);
							})}
						</nav>
					)}

					{/* Usuario y menú mobile */}
					<div className="flex items-center gap-2">
						{/* Theme Toggle */}
						<ThemeToggle />

						{/* Usuario */}
						{isAuthenticated ? (
							<div className="hidden sm:flex items-center gap-3">
								<div className="text-right">
									<span className="text-gray-700 dark:text-gray-300 text-sm">
										Bienvenido/a
									</span>
									{/* 🆕 Mostrar badge de rol para admin */}
									{user?.role === "admin" && (
										<div className="flex items-center gap-1">
											<span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
												✨ Admin
											</span>
										</div>
									)}
								</div>
								<Button
									size="sm"
									onClick={logout}
									className="h-10 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
								>
									Salir
								</Button>
							</div>
						) : (
							<Link href="/login">
								<Button
									size="sm"
									className="hidden sm:inline-flex h-10 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/25"
								>
									<LogInIcon className="w-fit h-6 mr-3" />
									Inicio de sesión
								</Button>
							</Link>
						)}

						{/* Menú hamburguesa para mobile */}
						<Button
							variant="ghost"
							size="sm"
							className="md:hidden p-2 hover:bg-blue-50 dark:hover:bg-blue-950/50"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
						>
							<Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
						</Button>
					</div>
				</div>

				{/* Menú móvil - 🆕 Usar items filtrados */}
				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-700/90 backdrop-blur-md">
						{isAuthenticated && (
							<nav className="flex flex-col gap-2 mb-4">
								{visibleItems.slice(1).map((item) => {
									const Icon = item.icon;
									return (
										<Link
											key={item.href}
											href={item.href}
											onClick={() => setIsMenuOpen(false)}
										>
											<Button
												variant={item.active ? "secondary" : "ghost"}
												size="sm"
												className={cn(
													"w-full justify-start gap-3 px-4 py-3",
													item.active
														? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400"
														: "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50",
												)}
											>
												<Icon className="w-5 h-5" />
												{item.label}
											</Button>
										</Link>
									);
								})}
							</nav>
						)}

						{/* Usuario en mobile */}
						{isAuthenticated ? (
							<div className="space-y-3">
								<div className="px-4">
									<p className="text-gray-700 dark:text-gray-300 text-sm">
										Bienvenido/a
									</p>
									{user?.role === "admin" && (
										<span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
											✨ Super Admin
										</span>
									)}
								</div>
								<Button
									size="sm"
									onClick={() => {
										logout();
										setIsMenuOpen(false);
									}}
									className="w-full h-10 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300"
								>
									Salir
								</Button>
							</div>
						) : (
							<Link href="/login">
								<Button
									size="sm"
									onClick={() => setIsMenuOpen(false)}
									className="w-full h-10 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300"
								>
									<LogInIcon className="w-fit h-6 mr-3" />
									Inicio de sesión
								</Button>
							</Link>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
