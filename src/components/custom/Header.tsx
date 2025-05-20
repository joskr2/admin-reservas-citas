"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Menu, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
	const { theme, setTheme } = useTheme();
	const { user } = useUser();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="container mx-auto flex h-14 items-center justify-between px-4">
				{/* Logo */}
				<Link href="/">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full hover:bg-accent/90 transition-all"
					>
						<img
							src="/logo.svg"
							alt="logo"
							className="hover:scale-105 transition-transform"
						/>
					</Button>
				</Link>

				{/* Botón de menú para móviles */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
				>
					<Menu className="h-5 w-5" />
				</Button>

				{/* Navegación */}
				<nav
					className={`absolute top-14 left-0 w-full  md:static md:flex md:items-center md:gap-4 ${
						isMenuOpen ? "block" : "hidden"
					}`}
				>
					<div className="flex flex-col md:flex-row md:items-center md:gap-4 p-4 md:p-0">
						{user ? (
							<>
								<Link href="/">
									<Button variant="ghost" className="w-full md:w-auto">
										Dashboard
									</Button>
								</Link>
								<Link href="/tasks/new">
									<Button variant="ghost" className="w-full md:w-auto">
										New Task
									</Button>
								</Link>
								<Link href="/settings">
									<Button variant="ghost" className="w-full md:w-auto">
										Settings
									</Button>
								</Link>
								<SignOutButton>
									<Button
										variant="outline"
										size="sm"
										className="w-full md:hidden" // Esta ya estaba correcta para móvil
									>
										Log out
									</Button>
								</SignOutButton>
							</>
						) : (
							<>
								{/* CORRECCIÓN AQUÍ: Cambiado md:w-auto a md:hidden */}
								<SignInButton mode="modal">
									<Button variant="outline" className="w-full md:hidden">
										Log in
									</Button>
								</SignInButton>
								{/* CORRECCIÓN AQUÍ: Cambiado md:w-auto a md:hidden */}
								<Link href="/register">
									<Button className="w-full md:hidden">Register</Button>
								</Link>
							</>
						)}

						{/* Botón de alternancia de tema para móviles */}
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setTheme(theme === "light" ? "dark" : "light")}
							className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium md:hidden"
						>
							{theme === "light" ? (
								<>
									<Moon className="h-4 w-4" />
									<span>Dark Mode</span>
								</>
							) : (
								<>
									<Sun className="h-4 w-4" />
									<span>Light Mode</span>
								</>
							)}
						</Button>
					</div>
				</nav>

				{/* Controles adicionales para escritorio */}
				<div className="hidden md:flex items-center gap-4">
					{user ? (
						<>
							<span className="text-sm">Hello, {user.firstName}</span>
							<SignOutButton>
								<Button variant="outline" size="sm">
									Log out
								</Button>
							</SignOutButton>
						</>
					) : (
						<>
							{/* Estos son los botones para escritorio, que se mantienen */}
							<SignInButton mode="modal">
								<Button variant="ghost">Log in</Button>
							</SignInButton>
							<Link href="/register">
								<Button>Register</Button>
							</Link>
						</>
					)}

					{/* Botón de alternancia de tema para escritorio */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-full">
								{theme === "light" ? (
									<Moon className="h-5 w-5" />
								) : (
									<Sun className="h-5 w-5" />
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setTheme("light")}>
								Light
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								Dark
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("system")}>
								System
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};

export default Header;
