"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Settings, Users, PlusCircle } from "lucide-react";
import { MOCK_USERS } from "@/lib/mockData";

export default function AdminPage() {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [currentProfile, setCurrentProfile] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const profileId = localStorage.getItem("selectedProfile");
		if (profileId) {
			const profile = MOCK_USERS.find((p) => p.id === profileId);
			if (profile) {
				setCurrentProfile({
					id: profile.id,
					nombre: profile.nombre,
					correo: profile.correo,
					especialidad: getEspecialidad(profile.nombre),
					rol: profile.rol,
				});
			} else {
				router.push("/admin/profiles");
			}
		} else {
			router.push("/admin/profiles");
		}
		setIsLoading(false);
	}, [router]);

	function getEspecialidad(nombre: string): string {
		const especialidades = {
			"Dr. Ana María González": "Psicología Clínica",
			"Dr. Carlos Mendoza": "Terapia Familiar",
			"Dra. Laura Jiménez": "Psicología Infantil",
			"Dr. Miguel Torres": "Terapia Cognitiva",
			"Dra. Elena Vásquez": "Psicología de Parejas",
		};

		return (
			especialidades[nombre as keyof typeof especialidades] ||
			"Psicología General"
		);
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">Cargando...</p>
				</div>
			</div>
		);
	}

	if (!currentProfile) {
		return null; // This will redirect in useEffect
	}

	const isAdmin = currentProfile.rol === "admin";

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="container mx-auto py-8 px-4">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						Panel de Administración
					</h1>
					<Button variant="outline" asChild>
						<Link href="/admin/profiles">Cambiar Perfil</Link>
					</Button>
				</div>

				{/* Profile Welcome Card */}
				<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 shadow-lg">
					<div className="flex items-center gap-4 mb-4">
						<div className="size-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
							<span className="text-lg font-semibold text-white">
								{currentProfile.nombre.charAt(0)}
							</span>
						</div>
						<div>
							<h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
								Bienvenido/a, {currentProfile.nombre}
							</h2>
							<p className="text-gray-600 dark:text-gray-400">
								{currentProfile.especialidad} • {currentProfile.correo}
							</p>
							{isAdmin && (
								<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 mt-1">
									✨ Super Administrador
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Action Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{/* Gestionar Citas */}
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 shadow-md">
						<div className="flex justify-between items-start mb-4">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
								Gestionar Citas
							</h3>
							<div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
								<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							Administra las citas con pacientes, inicia o termina sesiones.
						</p>
						<Button
							className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
							asChild
						>
							<Link href="/admin/citas">Ver Citas</Link>
						</Button>
					</div>

					{/* Calendario */}
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 shadow-md">
						<div className="flex justify-between items-start mb-4">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
								Calendario
							</h3>
							<div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
								<Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
							</div>
						</div>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							Visualiza y organiza las citas programadas.
						</p>
						<Button
							className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
							asChild
						>
							<Link href="/admin/citas">Ver Calendario</Link>
						</Button>
					</div>

					{/* Nueva Cita */}
					<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 shadow-md">
						<div className="flex justify-between items-start mb-4">
							<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
								Nueva Cita
							</h3>
							<div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
								<PlusCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
							</div>
						</div>
						<p className="text-gray-600 dark:text-gray-400 mb-4">
							Programa una nueva consulta con un paciente.
						</p>
						<Button
							className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
							asChild
						>
							<Link href="/admin/citas/nueva">Nueva Cita</Link>
						</Button>
					</div>

					{/* Admin-only card */}
					{isAdmin && (
						<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-yellow-200/50 dark:border-yellow-800/50 p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105 shadow-md md:col-span-2 lg:col-span-3">
							<div className="flex justify-between items-start mb-4">
								<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
									Administración del Sistema
								</h3>
								<div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
									<Settings className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
								</div>
							</div>
							<p className="text-gray-600 dark:text-gray-400 mb-4">
								Como super administrador, tienes acceso completo a todas las
								funcionalidades del sistema y puedes gestionar otros perfiles de
								psicólogos.
							</p>
							<div className="flex gap-4">
								<Button
									className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
									asChild
								>
									<Link href="/admin/profiles">Gestionar Perfiles</Link>
								</Button>
								<Button variant="outline" asChild>
									<Link href="/admin/citas">Ver Todas las Citas</Link>
								</Button>
							</div>
						</div>
					)}
				</div>

				{/* Quick Stats */}
				<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
						Estado del Sistema
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
							<div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
								Sistema Activo
							</div>
						</div>

						<div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
							<div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
								5 Psicólogos
							</div>
							<div className="text-sm text-purple-600/80 dark:text-purple-400/80">
								Perfiles Disponibles
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
