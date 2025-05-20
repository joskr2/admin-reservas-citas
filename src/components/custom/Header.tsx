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
import Image from "next/image";

const Header = () => {
	const { theme, setTheme } = useTheme();
	const { user } = useUser();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
			<div className="container mx-auto flex h-12 items-center justify-between px-4">
				{/* Logo */}
				<Link href="/">
					<Button
						variant="ghost"
						size="icon"
						className="rounded-full hover:bg-accent/90 transition-all"
					>
						<Image
							src="/logo.svg"
							width={32}
							height={32}
							alt="logo"
							className="hover:scale-105 transition-transform"
						/>
					</Button>
				</Link>

				{/* Botón de menú para móviles */}
				{/* <div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						className=" md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-fit "
					>
						{theme === "light" ? (
							<div className="w-fit">
								<Moon className="h-4 w-4" />
								<span>Modo oscuro</span>
							</div>
						) : (
							<>
								<Sun className="h-4 w-4" />
								<span>Modo claro</span>
							</>
						)}
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						<Menu className="h-5 w-5" />
					</Button>
				</div> */}
				<div className="flex  gap-2 flex-row items-end">
					<SignInButton mode="modal">
						<Button variant="ghost" className="w-fit md:hidden">
							Inicio sesión
						</Button>
					</SignInButton>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
						className=" md:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium w-fit "
					>
						{theme === "light" ? (
							<div className="w-fit">
								<Moon className="h-4 w-4" />
								{/* <span>Modo oscuro</span> */}
							</div>
						) : (
							<>
								<Sun className="h-4 w-4" />
								{/* <span>Modo claro</span> */}
							</>
						)}
					</Button>
					{/* <Link href="/register">
									<Button className="w-full md:hidden">Registro</Button>
								</Link> */}
				</div>

				<nav
					className={`absolute top-14 left-0 w-full  md:static md:flex md:items-center md:gap-4 ${
						isMenuOpen ? "block" : "hidden"
					}`}
				>
					<div className="flex flex-col md:flex-row md:items-center gap-2 items-end mr-4">
						{user ? (
							<>
								<Link href="/">
									<Button variant="ghost" className="w-fit md:w-auto">
										Inicio
									</Button>
								</Link>
								<Link href="/tasks/new">
									<Button variant="ghost" className="w-full md:w-auto">
										Nueva tarea
									</Button>
								</Link>
								<Link href="/settings">
									<Button variant="ghost" className="w-full md:w-auto">
										Configuraciones
									</Button>
								</Link>
								<SignOutButton>
									<Button
										variant="outline"
										size="sm"
										className="w-full md:hidden"
									>
										Salir
									</Button>
								</SignOutButton>
							</>
						) : (
							<div className="flex  gap-2 flex-col md:flex-row items-end">
								<SignInButton mode="modal">
									<Button variant="outline" className="w-fit md:hidden">
										Inicio sesión
									</Button>
								</SignInButton>
								{/* <Link href="/register">
									<Button className="w-full md:hidden">Registro</Button>
								</Link> */}
							</div>
						)}
					</div>
				</nav>

				<div className="hidden md:flex items-center gap-4">
					{user ? (
						<>
							<span className="text-sm">
								Hola, {user?.firstName ?? "Usuario"}
							</span>
							<SignOutButton>
								<Button variant="outline" size="sm">
									Salir
								</Button>
							</SignOutButton>
						</>
					) : (
						<>
							{/* Estos son los botones para escritorio, que se mantienen */}
							<SignInButton mode="modal">
								<Button variant="ghost" className="w-fit">
									Iniciar sesión
								</Button>
							</SignInButton>
							{/* <Link href="/register">
								<Button>Registro</Button>
							</Link> */}
						</>
					)}

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="rounded-md">
								{theme === "light" ? (
									<Moon className="h-5 w-5" />
								) : (
									<Sun className="h-5 w-5" />
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => setTheme("light")}>
								Modo Claro
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("dark")}>
								Modo Oscuro
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setTheme("system")}>
								Automático
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};

export default Header;
