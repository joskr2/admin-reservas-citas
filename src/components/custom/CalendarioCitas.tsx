"use client";

import { useEffect, useState, useCallback } from "react";
import { type Cita, obtenerCitasUsuario } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	PlusCircle,
	ChevronLeft,
	ChevronRight,
	Calendar,
	Clock,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CitaModal from "./CitaModal";
import { PageLoading } from "@/components/ui/loading";
import { MOCK_USERS } from "@/lib/mockData";

// Define a type for the profile
interface Profile {
	id: string;
	nombre: string;
	correo: string;
	tipo: "admin" | "psicologo" | "cliente";
}

export default function CalendarioCitas() {
	const router = useRouter();

	const [citas, setCitas] = useState<Cita[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [fechaActual, setFechaActual] = useState(new Date());
	const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

	useEffect(() => {
		const profileId = localStorage.getItem("selectedProfile");
		if (profileId) {
			const profile = MOCK_USERS.find((p) => p.id === profileId);
			if (profile) {
				setCurrentProfile({
					id: profile.id,
					nombre: profile.nombre,
					correo: profile.correo,
					tipo: profile.rol,
				});
			} else {
				toast.error("Perfil no encontrado.");
				router.push("/admin/profiles");
			}
		} else {
			toast.info(
				"No hay perfil seleccionado. Por favor, selecciona un perfil.",
			);
			router.push("/admin/profiles");
		}
	}, [router]);

	// Memoize cargarCitas with useCallback
	const cargarCitas = useCallback(async () => {
		if (!currentProfile) return;

		setIsLoading(true);
		try {
			const response = await obtenerCitasUsuario(currentProfile.id);
			if (response.success && response.data) {
				setCitas(response.data);
			} else {
				toast.error(response.message || "Error al cargar las citas");
				setCitas([]);
			}
		} catch (error) {
			console.error("Error al cargar citas:", error);
			toast.error("Ha ocurrido un error al cargar las citas");
			setCitas([]);
		} finally {
			setIsLoading(false);
		}
	}, [currentProfile]);

	useEffect(() => {
		if (currentProfile) {
			cargarCitas();
		}
	}, [currentProfile, cargarCitas]);

	const handleNuevaCita = () => {
		router.push("/citas/nueva");
	};

	const handleCitaClick = (cita: Cita) => {
		setCitaSeleccionada(cita);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setCitaSeleccionada(null);
	};

	const handleUpdateCita = () => {
		cargarCitas();
	};

	const obtenerDiasDelMes = (fecha: Date) => {
		const año = fecha.getFullYear();
		const mes = fecha.getMonth();

		const primerDia = new Date(año, mes, 1);
		const ultimoDia = new Date(año, mes + 1, 0);
		const primerDiaSemana = primerDia.getDay();

		const diasAMostrar: Date[] = [];

		// Agregar días del mes anterior para completar la primera semana
		for (let i = primerDiaSemana - 1; i >= 0; i--) {
			diasAMostrar.push(new Date(año, mes, -i));
		}

		// Agregar todos los días del mes actual
		for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
			diasAMostrar.push(new Date(año, mes, dia));
		}

		// Agregar días del mes siguiente para completar la última semana
		const diasRestantes = 42 - diasAMostrar.length; // 6 semanas x 7 días = 42
		for (let dia = 1; dia <= diasRestantes; dia++) {
			diasAMostrar.push(new Date(año, mes + 1, dia));
		}

		return diasAMostrar;
	};

	const obtenerCitasDelDia = (fecha: Date): Cita[] => {
		const fechaStr = fecha.toISOString().split("T")[0];
		return citas.filter((cita) => cita.fecha === fechaStr);
	};

	const mesAnterior = () => {
		setFechaActual(
			new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1),
		);
	};

	const mesSiguiente = () => {
		setFechaActual(
			new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1),
		);
	};

	const esMesActual = (fecha: Date): boolean => {
		return fecha.getMonth() === fechaActual.getMonth();
	};

	const esHoy = (fecha: Date): boolean => {
		const hoy = new Date();
		return fecha.toDateString() === hoy.toDateString();
	};

	const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
	const meses = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	];

	if (!currentProfile) {
		return <PageLoading text="Cargando perfil..." />;
	}

	if (isLoading) {
		return <PageLoading text="Cargando calendario..." />;
	}

	const esPsicologo =
		currentProfile.tipo === "psicologo" || currentProfile.tipo === "admin";

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
					<div>
						<h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
							Calendario de Citas
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Perfil activo: {currentProfile.nombre}
						</p>
					</div>
					{esPsicologo && (
						<Button
							onClick={handleNuevaCita}
							size="lg"
							className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
						>
							<PlusCircle className="mr-2 h-5 w-5" />
							Nueva Cita
						</Button>
					)}
				</div>

				{/* Calendario */}
				<Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
					<CardHeader className="pb-4">
						<div className="flex justify-between items-center">
							<Button
								variant="outline"
								size="sm"
								onClick={mesAnterior}
								className="hover:bg-blue-50 dark:hover:bg-blue-950/50 h-8 w-8 sm:h-10 sm:w-10 p-0"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>

							<CardTitle className="text-lg sm:text-2xl font-bold text-center px-2">
								<span className="hidden sm:inline">
									{meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
								</span>
								<span className="sm:hidden">
									{meses[fechaActual.getMonth()].slice(0, 3)}{" "}
									{fechaActual.getFullYear()}
								</span>
							</CardTitle>

							<Button
								variant="outline"
								size="sm"
								onClick={mesSiguiente}
								className="hover:bg-blue-50 dark:hover:bg-blue-950/50 h-8 w-8 sm:h-10 sm:w-10 p-0"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</CardHeader>

					<CardContent className="p-2 sm:p-6">
						{/* Días de la semana */}
						<div className="grid grid-cols-7 gap-1 mb-4">
							{diasSemana.map((dia) => (
								<div
									key={dia}
									className="p-2 sm:p-3 text-center font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs sm:text-sm"
								>
									<span className="hidden sm:inline">{dia}</span>
									<span className="sm:hidden">{dia.slice(0, 1)}</span>
								</div>
							))}
						</div>

						{/* Grilla del calendario */}
						<div className="grid grid-cols-7 gap-1">
							{obtenerDiasDelMes(fechaActual).map((fecha, index) => {
								const citasDelDia = obtenerCitasDelDia(fecha);
								const esDelMesActual = esMesActual(fecha);
								const esEsteHoy = esHoy(fecha);

								return (
									<div
										key={`${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}-${index}`}
										className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 border rounded-lg transition-all duration-200 hover:shadow-md ${
											esDelMesActual
												? esEsteHoy
													? "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 shadow-md"
													: "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
												: "bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500"
										}`}
									>
										<div
											className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
												esEsteHoy
													? "text-blue-600 dark:text-blue-400"
													: esDelMesActual
														? "text-gray-900 dark:text-gray-100"
														: "text-gray-400 dark:text-gray-500"
											}`}
										>
											{fecha.getDate()}
										</div>

										{citasDelDia.length > 0 && (
											<div className="space-y-1">
												{citasDelDia.slice(0, 2).map((cita) => (
													// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
														key={cita.id}
														className="text-[10px] sm:text-xs p-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded truncate cursor-pointer hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
														title={`${cita.hora_inicio} - ${cita.cliente.nombre}`}
														onClick={() => handleCitaClick(cita)}
													>
														<div className="hidden sm:flex items-center gap-1">
															<Clock className="w-2 h-2 sm:w-3 sm:h-3" />
															<span>{cita.hora_inicio}</span>
														</div>
														<div className="flex items-center gap-1">
															<User className="w-2 h-2 sm:w-3 sm:h-3" />
															<span className="truncate">
																{cita.cliente.nombre.split(" ")[0]}
															</span>
														</div>
													</div>
												))}
												{citasDelDia.length > 2 && (
													// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
														className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 text-center py-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
														onClick={() => handleCitaClick(citasDelDia[0])}
													>
														+{citasDelDia.length - 2} más
													</div>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>

				{/* Resumen del día actual */}
				{obtenerCitasDelDia(new Date()).length > 0 && (
					<Card className="mt-6 sm:mt-8 shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
								<Calendar className="w-5 h-5 text-blue-600" />
								Citas de Hoy
							</CardTitle>
							<CardDescription className="text-sm sm:text-base">
								{obtenerCitasDelDia(new Date()).length} citas programadas para
								hoy
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3 sm:space-y-4">
								{obtenerCitasDelDia(new Date()).map((cita) => (
									// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
										key={cita.id}
										className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-105"
										onClick={() => handleCitaClick(cita)}
									>
										<div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
											<div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
												<User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
											</div>
											<div>
												<h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
													{cita.cliente.nombre}
												</h3>
												<p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
													{cita.cliente.correo}
												</p>
												<p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
													Sala {cita.habitacion.numero}
												</p>
											</div>
										</div>
										<div className="text-left sm:text-right">
											<div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
												<Clock className="w-3 h-3 sm:w-4 sm:h-4" />
												<span>
													{cita.hora_inicio} - {cita.hora_fin}
												</span>
											</div>
											<span
												className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
													cita.estado === "pendiente"
														? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
														: cita.estado === "en_progreso"
															? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
															: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
												}`}
											>
												{cita.estado === "pendiente"
													? "Pendiente"
													: cita.estado === "en_progreso"
														? "En Progreso"
														: "Terminada"}
											</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Modal de cita */}
				<CitaModal
					cita={citaSeleccionada}
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					onUpdate={handleUpdateCita}
					esPsicologo={esPsicologo}
				/>
			</div>
		</div>
	);
}
