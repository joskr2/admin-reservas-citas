"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, ChevronRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_USERS } from "@/lib/mockData";

// Usar los datos mock reales
const PROFILES = MOCK_USERS.filter(
	(user) => user.rol === "psicologo" || user.rol === "admin",
).map((user) => ({
	id: user.id,
	nombre: user.nombre,
	especialidad:
		user.rol === "admin"
			? "Administrador - Psicología Clínica"
			: getEspecialidad(user.nombre),
	avatar: getAvatar(user.nombre),
	color: getColor(+(user.id)),
	isAdmin: user.rol === "admin",
}));

function getEspecialidad(nombre: string): string {
	const especialidades = {
		"Ana María González": "Psicología Clínica",
		"Carlos Mendoza": "Terapia Familiar",
		"Laura Jiménez": "Psicología Infantil",
		"Miguel Torres": "Terapia Cognitiva",
		"Elena Vásquez": "Psicología de Parejas",
	};

	return (
		especialidades[nombre as keyof typeof especialidades] ||
		"Psicología General"
	);
}

function getAvatar(nombre: string): string {
	const avatars = {
		"Ana María González": "👩‍⚕️",
		"Carlos Mendoza": "👨‍⚕️",
		"Laura Jiménez": "👩‍🏫",
		"Miguel Torres": "🧑‍⚕️",
		"Elena Vásquez": "👩‍💼",
	};

	return avatars[nombre as keyof typeof avatars] || "👨‍⚕️";
}

function getColor(id: number): string {
	const colors = [
		"from-pink-400 to-rose-500",
		"from-blue-400 to-indigo-500",
		"from-green-400 to-emerald-500",
		"from-purple-400 to-violet-500",
		"from-amber-400 to-orange-500",
	];

	return colors[(id - 1) % colors.length];
}

export default function ProfilesPage() {
	const [selectedProfile, setSelectedProfile] = useState<number | null>(null);
	const router = useRouter();

	const handleProfileSelect = (profileId: number) => {
		setSelectedProfile(profileId);
		localStorage.setItem("selectedProfile", profileId.toString());
		document.cookie = `selectedProfile=${profileId}; path=/`;

		setTimeout(() => {
			router.push("/admin");
		}, 500);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
			<div className="w-full max-w-6xl">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
						¿Quién está trabajando hoy?
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-400">
						Selecciona tu perfil para continuar
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
					{PROFILES.map((profile) => (
						<Card
							key={profile.id}
							className={`group cursor-pointer transition-all duration-300 transform hover:scale-105 border-0 bg-gradient-to-br ${
								profile.color
							} shadow-2xl ${
								selectedProfile === +profile.id
									? "ring-4 ring-blue-500 scale-105"
									: ""
							} relative`}
							onClick={() => handleProfileSelect(+profile.id)}
						>
							{profile.isAdmin && (
								<div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg z-10">
									<Crown className="w-4 h-4 text-yellow-800" />
								</div>
							)}

							<CardContent className="p-6 text-center space-y-4">
								<div className="relative mx-auto w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl group-hover:bg-white/30 transition-all duration-300">
									{profile.avatar}
									{selectedProfile === +profile.id && (
										<div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />
									)}
								</div>
								<div>
									<h3 className="text-lg font-bold text-white mb-1 drop-shadow-sm">
										{profile.nombre}
									</h3>
									<p className="text-sm text-white/90 drop-shadow-sm">
										{profile.especialidad}
									</p>
									{profile.isAdmin && (
										<p className="text-xs text-yellow-200 font-medium mt-1 drop-shadow-sm">
											✨ Super Administrador
										</p>
									)}
								</div>
								<div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<ChevronRight className="w-6 h-6 text-white mx-auto drop-shadow-sm" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="text-center">
					<Button
						variant="outline"
						className="bg-white/80 dark:bg-gray-800/80 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-800/90 backdrop-blur-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
						onClick={() => router.push("/login")}
					>
						<User className="w-4 h-4 mr-2" />
						Cambiar Usuario
					</Button>
				</div>
			</div>
		</div>
	);
}
